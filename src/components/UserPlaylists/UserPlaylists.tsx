import React, { Component } from 'react';
import { Auth0Authentication } from '../../auth/Auth0Authentication';
import { UserPlaylists as SpotifyUserPlaylists, SpotifyApiContext } from 'react-spotify-api'
import autobind from 'autobind-decorator';

export interface UserPlaylistsProps {
    auth: Auth0Authentication;
}

/**
 * @public
 * @export
 * @class User
 * @extends {Component<UserPlaylistsProps>}
 */
class UserPlaylists extends Component<any> {

    @autobind
    onClick(e, id) {
        e.preventDefault();
        this.props.history.push(`/playlists/${id}`);
    }

    gridStyle(){
        let numberOfColumns = Math.floor(window.screen.width / 450);
        return {
          gridTemplateColumns: `repeat(${numberOfColumns}, minmax(200px, 1fr))`
        };
    }
    render() {
        const { authenticated } = this.props.auth;
        return (
            <div className="container">
                {authenticated && this.props.auth.accessToken && (
                    <SpotifyApiContext.Provider value={this.props.auth.accessToken}>
                        <SpotifyUserPlaylists options={{ limit: 50 }}>
                            {(playlists, loading, error) =>
                                playlists ? (
                                    <div className="img-grid" style={this.gridStyle()}>{
                                        playlists.items.map(playlist => (
                                            <div key={playlist.id} onClick={(e) => this.onClick(e, playlist.id)}>
                                                <img src={playlist.images[0].url} className='plimg' alt=""/>
                                                <h5>{playlist.name}</h5>
                                            </div>
                                        ))
                                    }</div>) : null
                            }
                        </SpotifyUserPlaylists>
                    </SpotifyApiContext.Provider>
                )}
            </div>
        );
    }
}

export default UserPlaylists;
