import React from "react";
import createReactClass from "create-react-class";
import ReactDom from "react-dom";
import {Router, Route, IndexRoute, hashHistory} from "react-router";
import PropTypes from "prop-types";

import $ from "jquery";

import AppConfig from "./config";

import LoginView from "./views/Login";
import VideosView from "./views/Videos";
import AddVideoView from "./views/videos/Add";
import ViewVideoView from "./views/videos/View";

var App, AppEnv;

AppEnv = AppConfig.get(AppConfig.get("environment"));

App = createReactClass({
    ajaxRequests: [],

    contextTypes: {
        router: PropTypes.object.isRequired
    },

    getInitialState(){
        var state;
		
		return state = {};
    },

    componentWillMount(){
        var View;
		View = this;
		
		View.context.router.push("/videos");
    },

    componentDidMount(){
        var View, userId;
		View = this;
    },

    componentWillUnmount(){
        var View, i;
		View = this;

		for(i=0; i<View.ajaxRequests.length; i++){
			View.ajaxRequests[parseInt(i)].abort();
		}
    },

    render(){
        var app;
		app = this;
		return React.cloneElement(this.props.children, {
			app
		});
    }
});

ReactDom.render(
    (
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={VideosView}/>
                <Route path="login" component={LoginView}/>
                <Route path="videos" component={VideosView}/>
                <Route path="add-video" component={AddVideoView}/>
                <Route path="/videos/:videoId/:videoTitle" component={ViewVideoView}/>
            </Route>
        </Router>
    ), document.getElementById("app")
);
