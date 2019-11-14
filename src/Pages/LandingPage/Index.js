import React, { Component } from 'react';
import {
    View, Button, Text,
} from 'react-native';
import { getCookie, deleteCookie } from '../../utils/cookie-logic';

require('dotenv');

const jwt = require('jsonwebtoken');

class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    static navigationOptions = {
        title: 'Landing Page',
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
            // if (decodedJSONWebToken !== 'no cookie' || decodedJSONWebToken !== 'expired') {
            //     navigate('dashboard');
            // }
        });
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <View>
                <View className="navbarContainer">
                    <View className="landingPageButton">
                        <Button title="Logo" onPress={() => navigate('landingpage')} />
                    </View>
                    <View className="loginButton">
                        <Button title="Log In" onPress={() => navigate('login')} />
                    </View>
                    <View className="signUpButton">
                        <Button title="Sign Up" onPress={() => navigate('signup')} />
                    </View>
                </View>

                <Text className="landing-page-label">Landing Page</Text>
            </View>
        );
    }
}

export default LandingPage;
