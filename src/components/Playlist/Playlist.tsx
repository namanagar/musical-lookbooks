import React, { Component } from 'react';
import { Auth0Authentication } from '../../auth/Auth0Authentication';
import { Playlist as SpotifyPlaylist, SpotifyApiContext, TrackFeatures } from 'react-spotify-api'

export interface PlaylistProps {
    auth: Auth0Authentication,
    id: string | undefined
}

const median = arr => {
    const mid = Math.floor(arr.length / 2), nums = [...arr].sort((a, b) => a - b);
    let ans = arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    return +ans.toFixed(2);
  };

const mode = (array) => {
    var frequency = {}; // array of frequency.
    var maxFreq = 0; // holds the max frequency.
    var modes = [] as any;
    for (var i in array) {
        frequency[array[i]] = (frequency[array[i]] || 0) + 1; // increment frequency.
        if (frequency[array[i]] > maxFreq) { // is this frequency > max so far ?
        maxFreq = frequency[array[i]]; // update max.
        }
    }
    for (var k in frequency) {
        if (frequency[k] === maxFreq) {
            modes.push(k);
        }
    }
    return modes;
}

const mood = (valence) => {
    const dict: { [key: number]: string } = {0.1: '😭', 0.2: '😰', 0.3: '😥', 0.4: '😫', .5: '🙂', .6: '🙃', .7: '😏', .8: '😊', .9: '😈', 1: '😈'};
    const rounded = Math.round(valence * 10) / 10;
    return dict[rounded];
}

const pitchClass = (pitch) => {
    const dict: { [key: number]: string } = {0: 'C', 1: 'C#/Db', 2: 'D', 3: 'D#/Eb', 4: 'E', 5: 'F', 6: 'F#/Gb', 7:'G', 8:'G#/Ab', 9:'A', 10: 'A#/Bb', 11: 'B'};
    return dict[pitch];
}

const modeMap = (mode) => {
    return mode === 0 ? 'minor' : 'major'
}

const keyConverter = (val: []) => {
    let ret : string[] = [];
    val.forEach(function(v: string){
        let arr = v.split(' ');
        ret.push(pitchClass(arr[1]) + ' ' + modeMap(arr[0]))
    })
    return ret.join(', ');
}

const msToTime = (ms) => {
    ms = 1000*Math.round(ms/1000);
    let d : Date = new Date(ms);
    return d.getUTCMinutes() + " min, " + d.getUTCSeconds() + " sec";
}

/**
 * @public
 * @export
 * @class User
 * @extends {Component<PlaylistProps>}
 */
class User extends Component<PlaylistProps> {
    render() {
        const { authenticated } = this.props.auth;
        return (
            <div className="container">
                {authenticated && this.props.auth.accessToken && (
                    <SpotifyApiContext.Provider value={this.props.auth.accessToken}>
                        <SpotifyPlaylist id={this.props.id} options={{ limit: 10 }}>
                            {(playlist, loading, error) =>
                                playlist ? (
                                    <div className="row">
                                        <div className="col-sm-12 col-md-6">
                                            <h4>{playlist.name} ({playlist.owner.display_name})</h4>
                                                <img src={playlist.images[0].url} className='plimg' alt=""/>
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            <TrackFeatures id={playlist.tracks.items.filter(Boolean).map(i => i.track.id)}>
                                                {(features, loading, error) => (
                                                    features ? ( features.audio_features ? (
                                                        <div>
                                                            <h1>tempo: {median(features.audio_features.filter(Boolean).map(f => f.tempo))}</h1>
                                                            <h1>length: {msToTime(median(features.audio_features.filter(Boolean).map(f => f.duration_ms)))}</h1>
                                                            <h1>key: {keyConverter(mode(features.audio_features.filter(Boolean).map(f => f.mode + ' ' + f.key )))}</h1>
                                                            <h1>mood: {mood(median(features.audio_features.filter(Boolean).map(f => f.valence)))}</h1>
                                                        </div>
                                                    ) : null
                                                ): null ) }
                                            </TrackFeatures>
                                        </div>
                                    </div>
                                ) : null
                            }
                        </SpotifyPlaylist>
                    </SpotifyApiContext.Provider>

                )}
            </div>
        );
    }
}

export default User;
