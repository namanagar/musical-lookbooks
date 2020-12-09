import autobind from 'autobind-decorator';
import React, { Component } from 'react';
import { Auth0Authentication } from '../../auth/Auth0Authentication';
import { ReactComponent as LoginButton } from './login.svg';
import logo from "../../logo.svg";

export interface HomeProps {
    auth: Auth0Authentication;
}

const loginButtonStyle = {
    width: '17.5vw',
    marginTop: '2vh'
};

export default class Home extends Component<HomeProps, {}> {
    @autobind
    login() {
        this.props.auth.login();
    }

    @autobind
    logout() {
        this.props.auth.logout();
    }

    render() {
        const { authenticated } = this.props.auth;
        return (
            <div>
                {authenticated && (
                    <div>
                        {this.props.auth.accessToken && (
                            <div className="m-4">
                                <h2>click on playlists y are u here</h2>
                            </div>
                        )}
                        <p>
                        </p>
                    </div>
                )}
                {!authenticated && (
                    <div className="m-4 container-fluid text-center">
                        <img src={logo} className="logo" alt="logo"/>
                        <h1>log into spotify to get started</h1>
                        <LoginButton fill="#1DB954" style={loginButtonStyle} onClick={this.login} />
                    </div>
                )}
            </div>
        );
    }
}