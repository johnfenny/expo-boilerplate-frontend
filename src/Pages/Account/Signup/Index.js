import React, { Component } from 'react';
import {
    View, Text, TextInput, Button,
} from 'react-native';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';
import { getCookie, setCookie, deleteCookie } from '../../../utils/cookie-logic';

const jwt = require('jsonwebtoken');

const createNewUserMutation = gql`
    mutation createNewUser($email: String!, $password: String!, $clientMetadata: JSON!) {
        createNewUser(email: $email, password: $password, clientMetadata: $clientMetadata)
    }
`;

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label: 'Create an account.',
            email: '',
            password: '',
            confirmPassword: '',
            ipAddress: '',
            createAccountButtonText: 'Login',
        };
    }

    static navigationOptions = {
        title: 'Signup',
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
                navigate('Dashboard');
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

    confirmPasswordInput = (event) => {
        event.preventDefault();
        this.setState({
            confirmPassword: event.target.value,
        });
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
                    <View className="loginButton">
                        <Button title="Log In" onPress={() => { navigate('login'); }} />
                    </View>
                </View>
                {/* End Navbar */}

                {/* Begin SignUp Form */}
                <View className="signUpContainer">
                    <Text className="formLabel">{this.state.label}</Text>
                    <TextInput className="input" value={this.state.email} placeholder="Email" onChange={this.emailInput} />
                    <TextInput secureTextEntry className="input" value={this.state.password} placeholder="Password" onChange={this.passwordInput} />
                    <TextInput secureTextEntry className="input" value={this.state.confirmPassword} placeholder="Confirm Password" onChange={this.confirmPasswordInput} />
                    {/* <TextInput
                            className="input"
                            value={this.state.firstName}
                            placeholder="First Name"
                            onChange={this.firstNameInput}
                        />
                    */}
                    {/* <TextInput
                            className="input"
                            value={this.state.lastName}
                            placeholder="Last Name"
                            onChange={this.lastNameInput}
                        />
                    */}
                    {/* <TextInput
                            className="input"
                            value={this.state.age}
                            placeholder="Age"
                            onChange={this.ageInput}
                        />
                    */}
                    <Mutation
                        mutation={createNewUserMutation}
                        onCompleted={(response) => {
                            if (response.createNewUser) {
                                setCookie('JSONWebToken', response.createNewUser, 1);
                                navigate('dashboard');
                            }
                        }}
                    >
                        {(mutation, { loading, error, data }) => {
                            if (error) {
                                alert('Error!', error.message);
                                console.log("loading", loading);
                                console.log("error", error);
                                console.log("data", data);
                            }

                            return (
                                <Button
                                    title={this.state.createAccountButtonText}
                                    onPress={(event) => {
                                        event.preventDefault();

                                        if (this.state.email === ''
                                        || this.state.password === ''
                                        || this.state.confirmPassword === '') { // required fields
                                            alert('You have not filled out all of the required fields');
                                        } else if (this.state.email.indexOf('@') === -1
                                        || this.state.email.indexOf('.') === -1) { // email
                                            alert('Please provide a valid email address.');
                                        } else if (this.state.password !== this.state.confirmPassword) {
                                            alert('Passwords do not match!');
                                        } else if (this.state.password.length < 8) {
                                            alert('Password must be at least 8 characters.');
                                        } else {
                                            this.setState({
                                                createAccountButtonText: 'Loading...',
                                            });

                                            mutation({
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
                                            });
                                        }
                                    }}
                                />
                            );
                        }}
                    </Mutation>
                </View>
                {/* End SignUp Form */}
            </View>
        );
    }
}

export default Signup;
