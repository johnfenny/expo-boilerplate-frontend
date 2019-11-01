import React, { Component } from 'react';

import { createSwitchNavigator } from '@react-navigation/core';
import { createBrowserApp } from '@react-navigation/web';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import LandingPage from './Pages/LandingPage/Index';
import Signup from './Pages/Account/Signup/Index';
import Login from './Pages/Account/Login/Index';
import Dashboard from './Pages/Dashboard/Index';

// BEGIN APOLLO CONFIG
const client = new ApolloClient({
    uri: 'https://expo-boilerplate-backend.netlify.com',
});
// END APOLLO CONFIG

// BEGIN ROUTES CONFIGURATION
const routes = {
    landingpage: LandingPage,
    signup: Signup,
    login: Login,
    dashboard: Dashboard,
};

const CreateNavigator = createSwitchNavigator(routes, {
    initialRouteName: 'landingpage',
});

const Navigator = createBrowserApp(CreateNavigator);
// END ROUTES CONFIGURATION

class App extends Component {
    componentDidMount() {

    }

    render() {
        return (
            <ApolloProvider client={client}>
                <Navigator />
            </ApolloProvider>
        );
    }
}

export default App;
