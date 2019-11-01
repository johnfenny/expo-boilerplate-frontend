import React, { Component } from 'react';
import {
    View, Text, Button,
} from 'react-native';
import { getCookie, deleteCookie } from '../../utils/cookie-logic';

require('dotenv');

const jwt = require('jsonwebtoken');

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
        };
    }

    static navigationOptions = {
        title: 'Dashboard',
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };

    componentWillMount() {
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
            if (decodedJSONWebToken === 'no cookie' || decodedJSONWebToken === 'expired') {
                navigate('login');
            }
        });
    }

    componentDidMount() {
        const { navigate } = this.props.navigation;

        const JSONWebToken = getCookie('JSONWebToken');
        if (!JSONWebToken) {
            navigate('login');
        }

        async function decodeJSONWebToken() {
            let decodedJSONWebToken;
            try {
                decodedJSONWebToken = await jwt.verify(JSONWebToken, 'aYU$coy#@M%vNPkh$8a!6FpEEeASn%L9akE1KB*4Oz8&&5d9&#');
            } catch (error) {
                return 'expired';
            }
            return decodedJSONWebToken;
        }

        // let decodedJSONWebToken;
        decodeJSONWebToken().then((decodedJSONWebToken) => {
            if (decodedJSONWebToken === 'expired') {
                navigate('Login');
            }
            if (this.state.email !== decodedJSONWebToken.email) {
                this.setState({ email: decodedJSONWebToken.email });
            }
        });
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View>
                {/* Begin Navbar */}
                <View className="navbarContainer">
                    <View className="landingPageButton">
                        <Button title="Logo" onPress={() => navigate('dashboard')} />
                    </View>
                    <View className="landingPageButton">
                        <Button
                            title="Logout"
                            onPress={() => {
                                deleteCookie('JSONWebToken');
                                navigate('landingpage');
                            }}
                        />
                    </View>
                </View>
                {/* End Navbar */}
                <Text className="loggedInUser">
                    You are logged in as:
                    {" " + this.state.email}
                </Text>
            </View>
        );
    }
}

export default Dashboard;
