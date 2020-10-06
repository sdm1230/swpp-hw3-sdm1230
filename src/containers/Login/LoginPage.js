import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';

import './LoginPage.css';

import * as actionCreators from '../../store/actions/index';

class LoginPage extends Component {
    state = {
        email: "",
        password: "",
    }

    componentDidMount() {
        this.props.onGetAll_USERS();

    }

    loginHandler = () => {
        const loginUser = this.props.storedUsers.find(user => this.state.email === user.email && this.state.password === user.password)

        if (loginUser?.name.length > 0) {
            this.props.onSetLogin(loginUser)

        }
        else
            alert("Email or password is wrong");
    }

    render() {
        if (this.props.storedUsers.find(user => user.logged_in)?.name.length > 0) return <Redirect to='/articles' />

        return (
            <div className="LoginPage">

                <h1>LoginPage</h1>

                <div className="inputBox">
                    <label>Email</label>
                    <input
                        id="email-input"
                        type="text"
                        value={this.state.email}
                        onChange={(event) => this.setState({ email: event.target.value })}
                    >
                    </input>
                </div>

                <div className="inputBox">
                    <label>Password</label>
                    <input
                        id="pw-input"
                        type="text"
                        value={this.state.password}
                        onChange={(event) => this.setState({ password: event.target.value })}
                    >
                    </input>
                </div>

                <div className="login">
                    <button
                        id="login-button"
                        onClick={() => this.loginHandler()}>Login
                </button>
                </div>
            </div>

        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSetLogin: (user) => {
            dispatch(actionCreators.setUser(user))
        },
        onGetAll_USERS: () => dispatch(actionCreators.getUsers()),
    };
};
const mapStateToProps = state => {
    return {
        storedUsers: state.users.users,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);