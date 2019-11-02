import React, { Component } from 'react';
import {
    View, Text, TextInput, Button,
} from 'react-native';
import { gql } from 'apollo-boost';
import { withApollo } from 'react-apollo';
import { getCookie, setCookie, deleteCookie } from '../../../utils/cookie-logic';

const jwt = require('jsonwebtoken');

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loginButtonText: 'Login',
            ipAddress: '',
        };
    }

    static navigationOptions = {
        title: 'Login',
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };

    componentWillMount() {

    }

    componentDidMount() {
        const { navigate } = this.props.navigation;

        async function decodeJSONWebToken() {
            try {
                if (getCookie('JSONWebToken')) {
                    return jwt.verify(getCookie('JSONWebToken'), 'aYU$coy#@M%vNPkh$8a!6FpEEeASn%L9akE1KB*4Oz8&&5d9&#');
                }
            } catch (error) {
                return 'expired';
            }
            return 'no cookie';
        }

        decodeJSONWebToken().then((decodedJSONWebToken) => {
            if (decodedJSONWebToken !== 'no cookie' && decodedJSONWebToken !== 'expired') {
                navigate('dashboard');
            } else if (getCookie('JSONWebToken')) {
                deleteCookie('JSONWebToken');
            }
        });

        fetch('https://api.ipify.org?format=json').then((response) => {
            response.json().then((data) => {
                this.setState({
                    ipAddress: data.ip,
                });
            });
        });
    }

    emailInput = (event) => {
        event.preventDefault();
        this.setState({
            email: event.target.value,
        });
    }

    passwordInput = (event) => {
        event.preventDefault();
        this.setState({
            password: event.target.value,
        });
    }

    submitForm = () => {
        const { navigate } = this.props.navigation;

        if (this.state.email === '') {
            alert('Email cannot be blank.');
        } else if (this.state.password === '') {
            alert('Password cannot be blank.');
        } else if (this.state.email.indexOf('@') === -1 || this.state.email.indexOf('.') === -1) { // email
            alert('Please provide a valid email address.');
        } else {
            this.setState({
                loginButtonText: 'Loading...',
            });
            this.props.client.query({
                query: gql`
                query ($email: String!, $password: String!, $clientMetadata: JSON!) {
                    getExistingUser(email: $email, password: $password, clientMetadata: $clientMetadata)
                }`,
                variables: {
                    email: this.state.email,
                    password: this.state.password,
                    clientMetadata: {
                        ipAddress: this.state.ipAddress,
                        langauge: window.navigator.langauge,
                        platform: window.navigator.platform,
                        connection: window.navigator.connection.effectiveType,
                        cookieEnabled: window.navigator.cookieEnabled,
                        deviceMemory: window.navigator.deviceMemory,
                        doNotTrack: window.navigator.doNotTrack,
                        product: window.navigator.product,
                        geolocation: window.navigator.geolocation,
                        styleMedia: window.styleMedia.type,
                        orientation: window.screen.orientation.type,
                        height: window.screen.height,
                        width: window.screen.width,
                        timezone: new Date().getTimezoneOffset()/60,
                        timestamp: new Date().getTime(),
                        referrer: document.referrer,
                        previousSites: window.history.length,
                        browserName: window.navigator.appName,
                        online: window.navigator.online,
                        appVersion: window.navigator.appVersion,
                        userAgent: window.navigator.userAgent,
                        javaEnabled: window.navigator.javaEnabled,
                    },
                },
            }).then((response) => {
                setCookie('JSONWebToken', response.data.getExistingUser, 1);
                navigate('dashboard');
            }).catch((error) => {
                console.log("test", error);
            });
        }
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <View>
                {/* Begin Navbar */}
                <View className="navbarContainer">
                    <View className="landingPageButton">
                        <Button title="Logo" onPress={() => navigate('landingpage')} />
                    </View>
                    <View className="signUpButton">
                        <Button title="Sign Up" onPress={() => navigate('signup')} />
                    </View>
                </View>
                {/* End Navbar */}

                {/* BEGIN ACCOUNT FORM */}
                <View className="loginFormContainer">
                    <Text className="formLabel">Log in.</Text>
                    <TextInput className="input" value={this.state.email} placeholder="Email" name="username" onChange={this.emailInput} />
                    <TextInput secureTextEntry className="input" value={this.state.password} placeholder="Password" name="password" onChange={this.passwordInput} />
                    <View class Name="loginAccountButton">
                        <Button
                            title={this.state.loginButtonText}
                            onPress={this.submitForm}
                        />
                    </View>
                </View>
                {/* END ACCOUNT FORM */}
            </View>
        );
    }
}

export default withApollo(Login);
