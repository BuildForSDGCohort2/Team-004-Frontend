import React from "react";
import createReactClass from "create-react-class";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppConfig from "../config";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Paper from "@material-ui/core/Paper/Paper";
import TextField from "@material-ui/core/TextField/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import $ from "jquery";

var LoginView, AppEnv;
AppEnv = AppConfig.get(AppConfig.get("environment"));

LoginView = createReactClass({
    viewName: "Login",

    ajaxRequests: [],

    getInitialState(){
        var View, cachedState, state;
		View = this;
		
		cachedState = JSON.parse(window.sessionStorage.getItem(AppEnv.namespace+"_login_view_state"));
			
		state = {
			currentTab: 1,
			name: {
				value: "",
				hasError: false,
				errorHelperText: "",
				hasChanged: false
			},
			email: {
				value: "",
				hasError: false,
				errorHelperText: "",
				hasChanged: false
			},
			password: {
				value: "",
				hasError: false,
				errorHelperText: "",
				hasChanged: false
			},
			repassword: {
				value: "",
				hasError: false,
				errorHelperText: "",
				hasChanged: false
			},
			role: "student",
			registerButton: {
				isActive: false,
				isLoading: false
			},
			loginButton: {
				isActive: false,
				isLoading: false
			},
			feedback: {
				open: false,
				message: ""
			}
		};

		return state;
    },

    componentWillMount(){
        var View;
		View = this;
    },

    componentDidMount(){
        var View = this;
		var userId;

		userId = localStorage.getItem(AppEnv.namespace+"_user_id");
		if(userId !== null){
			View.props.router.push("/videos");
		}
    },

    componentWillUnmount(){
        var View, i;
		View = this;

		for(i=0; i<View.ajaxRequests.length; i++){
			View.ajaxRequests[parseInt(i)].abort();
		}

		window.sessionStorage.setItem(AppEnv.namespace+"_login_view_state", JSON.stringify(View.state));
    },

    handleFeedbackClose(){
        this.setState({
			feedback: {
				open: false,
				message: null
			}
		});
    },

	changeTab(e, value){
		var View;

        View = this;

        if(window.localStorage.getItem(AppEnv.namespace+"_user_id") !== null){
            View.props.router.push("/");
        }

        View.setState({
            currentTab: value,
            name: {
                value: "",
                hasError: false,
                errorHelperText: "",
                hasChanged: false
            },
            email: {
                value: "",
                hasError: false,
                errorHelperText: "",
                hasChanged: false
            },
            password: {
                value: "",
                hasError: false,
                errorHelperText: "",
                hasChanged: false
            },
            repassword: {
                value: "",
                hasError: false,
                errorHelperText: "",
                hasChanged: false
            },
            role: "student",
            registerButton: {
                isActive: false
            },
            loginButton: {
                isActive: false
            },
            feedback: {
                open: false,
                message: ""
            }
        });
	},

	handleInputChange(e, id){
		var View, value, state;

		View = this;
		state = View.state;

		value = e.nativeEvent.target.value;

		switch(id){
			case "name":{
				state.name.value = value;
				state.name.hasChanged = true;
				if(value.length === 0){
					state.name.hasError = true;
					state.name.errorHelperText = "Value is required.";
				}else{
					state.name.hasError = false;
					state.name.errorHelperText = "";
				}
				break;
			}
			case "email":{
				state.email.value = value;
				state.email.hasChanged = true;
				if(value.length === 0){
					state.email.hasError = true;
					state.email.errorHelperText = "Value is required.";
				}else if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value.toLowerCase())){
					state.email.hasError = true;
					state.email.errorHelperText = "Valid email address required.";
				}else{
					state.email.hasError = false;
					state.email.errorHelperText = "";
				}
				break;
			}
			case "password":{
				state.password.value = value;
				state.password.hasChanged = true;
				if(value.length === 0){
					state.password.hasError = true;
					state.password.errorHelperText = "Value is required.";
				}else if(value.length <8){
					state.password.hasError = true;
					state.password.errorHelperText = "Minimum length is 8 characters.";
				}else{
					state.password.hasError = false;
					state.password.errorHelperText = "";
				}
				break;
			}
			case "repassword":{
				state.repassword.value = value;
				state.repassword.hasChanged = true;
				if(value !== View.state.password.value){
					state.repassword.hasError = true;
					state.repassword.errorHelperText = "Confirm the password value.";
				}else{
					state.repassword.hasError = false;
					state.repassword.errorHelperText = "";
				}
				break;
			}
			case "role":{
				state.role = e.target.value;
				break;
			}
		}

		View.setState(state, function(){
			View.validate(View.state.currentTab);
		});
	},

	validate(tab){
		var View, state, isValid;

		View = this;
		state = View.state;
		isValid = true;

		if(tab === 0){
			if(state.name.value.length === 0){
				if(state.name.hasChanged) {
					state.name.hasError = true;
					state.name.errorHelperText = "Value is required.";
				}
				isValid = false;
			}

			if(state.email.value.length === 0){
				if(state.email.hasChanged) {
					state.email.hasError = true;
					state.email.errorHelperText = "Value is required.";
				}
				isValid = false;
			}

			if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(state.email.value.toLowerCase())){
				if(state.email.hasChanged) {
					state.email.hasError = true;
					state.email.errorHelperText = "Valid email address required.";
				}
			}

			if(state.password.value.length === 0){
				if(state.password.hasChanged) {
					state.password.hasError = true;
					state.password.errorHelperText = "Value is required.";
				}
				isValid = false;
			}

			if(state.password.value.length < 8){
				if(state.password.hasChanged) {
					state.password.hasError = true;
					state.password.errorHelperText = "Minimum length is 8 characters.";
				}
				isValid = false;
			}

			if(state.repassword.value !== state.password.value){
				if(state.repassword.hasChanged) {
					state.repassword.hasError = true;
					state.repassword.errorHelperText = "Confirm the password value.";
				}
				isValid = false;
			}

			if(!isValid){
				if(state.name.hasChanged && state.email.hasChanged && state.password.hasChanged && state.repassword.hasChanged) {
					state.feedback = {
						open: true,
						message: "Please check errors on form."
					};
				}
			}

			state.registerButton.isActive = isValid;
			View.setState(state);
		}else if(tab === 1){
            if(state.email.value.length === 0){
                if(state.email.hasChanged) {
                    state.email.hasError = true;
                    state.email.errorHelperText = "Value is required.";
                }
                isValid = false;
            }

            if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(state.email.value.toLowerCase())){
                if(state.email.hasChanged) {
                    state.email.hasError = true;
                    state.email.errorHelperText = "Valid email address required.";
                }
            }

            if(state.password.value.length === 0){
                if(state.password.hasChanged) {
                    state.password.hasError = true;
                    state.password.errorHelperText = "Value is required.";
                }
                isValid = false;
            }

            if(state.password.value.length < 8){
                if(state.password.hasChanged) {
                    state.password.hasError = true;
                    state.password.errorHelperText = "Minimum length is 8 characters.";
                }
                isValid = false;
            }

            if(!isValid){
                if(state.email.hasChanged && state.password.hasChanged) {
                    state.feedback = {
                        open: true,
                        message: "Please check errors on form."
                    };
                }
            }

            state.loginButton.isActive = isValid;
            View.setState(state);
        }
	},

	register(e){
		var View, request, buttonState;

		View = this;
		buttonState = View.state.registerButton;

		if(View.state.registerButton.isActive){
			buttonState.isLoading = true;
			
			View.setState({
				registerButton: buttonState
			});

			request = $.ajax({
				url: AppEnv.backendUrl + "/users/register",
				cache: false,
				data: JSON.stringify({
					name: View.state.name.value,
					email: View.state.email.value,
					password: View.state.password.value,
					role: View.state.role
				}),
				contentType: "application/json",
				dataType: "json",
				error(xhr, status, error){
                    var response;
                    if("responseText" in xhr) {
                        response = JSON.parse(xhr.responseText);
                    }else if("statusText" in xhr){
                        response = xhr.statusText;
                    }else{
                        response = error;
                    }
					
                    buttonState.isLoading = false;
					
					View.setState({
						loginButton: buttonState,
                        feedback: {
                            open: true,
                            message: response.message
                        }
                    });
				},
				headers: {
				},
				method: "POST",
				success(data, status, xhr){
				    var state;

				    state = View.state;
					state.loginButton.isActive = true;
                    View.setState(state);
					View.login(e);
				}
			});

			View.ajaxRequests.push(request);
		}
	},

	login(e){
		var View, request, buttonState;

		View = this;
		buttonState = View.state.loginButton;

		if(View.state.loginButton.isActive){
			buttonState.isLoading = true;
			
			View.setState({
				loginButton: buttonState
			});

			request = $.ajax({
				url: AppEnv.backendUrl + "/users/login",
				cache: false,
				data: JSON.stringify({
					email: View.state.email.value,
					password: View.state.password.value
				}),
				contentType: "application/json",
				dataType: "json",
                error(xhr, status, error){
                    var response;
                    if("responseText" in xhr) {
                        response = JSON.parse(xhr);
                    }else if("statusText" in xhr){
                        response = xhr.statusText;
                    }else{
                        response = error;
                    }
					
					buttonState.isLoading = false;
					
                    View.setState({
						loginButton: buttonState,
                        feedback: {
                            open: true,
                            message: response.message
                        }
                    });
				},
				headers: {
				},
				method: "POST",
				success(data, status, xhr){
					window.localStorage.setItem(AppEnv.namespace+"_user_id", data.id);
                    window.localStorage.setItem(AppEnv.namespace+"_user_token", data.token);
                    window.localStorage.setItem(AppEnv.namespace+"_user_role", data.role);

                    View.props.router.push("/videos");
				}
			});

			View.ajaxRequests.push(request);
		}
	},

	render(){
        return (
			<Grid container className="c-login-view">
				<AppBar position="static">
					<Tabs
						value={this.state.currentTab}
						onChange={(e, value) => this.changeTab(e, value)}
						variant="fullWidth"
					>
						<Tab label="Sign Up"/>
						<Tab label="Sign In"/>
					</Tabs>
				</AppBar>
				<Grid item xs={12}>
					<div
						role="tabpanel"
						hidden={this.state.currentTab !== 0}
					>
						<div style={{ padding: "8px 16px"}}>
							<TextField
								id="name"
								size="medium"
								required
								fullWidth
								label="Full name"
								error={this.state.name.hasError}
								helperText={this.state.name.errorHelperText}
								onChange={(e) => this.handleInputChange(e, "name")}
								style={{ marginTop: "16px"}} />
							<TextField
								id="email"
								type="email"
								size="medium"
								required
								fullWidth
								label="Email"
								error={this.state.email.hasError}
								helperText={this.state.email.errorHelperText}
								onChange={(e) => this.handleInputChange(e, "email")}
								style={{ marginTop: "16px"}} />
							<TextField
								id="password"
								type="password"
								size="medium"
								required
								fullWidth
								label="Password"
								error={this.state.password.hasError}
								helperText={this.state.password.errorHelperText}
								onChange={(e) => this.handleInputChange(e, "password")}
								style={{ marginTop: "16px"}} />
							<TextField
								id="repassword"
								type="password"
								size="medium"
								required
								fullWidth
								label="Confirm password"
								error={this.state.repassword.hasError}
								helperText={this.state.repassword.errorHelperText}
								onChange={(e) => this.handleInputChange(e, "repassword")}
								style={{ marginTop: "16px"}} />
							<Select
								value={this.state.role}
								fullWidth={true}
								onChange={(e, index, value) => this.handleInputChange(e, "role")}
								style={{ marginTop: "32px"}} >
								<MenuItem value="student">I"m Student</MenuItem>
								<MenuItem value="teacher">I"m Teacher</MenuItem>
							</Select>
							<div
								style={{textAlign:"center", marginTop: "32px"}}
								>
								<Button
									variant="contained"
									color="primary"
									size="large"
									disabled={!this.state.registerButton.isActive}
									onClick={(e) => this.register(e)}
									>
									Sign Up
								</Button>
							</div>
							{
								this.state.registerButton.isLoading && <div style={{ textAlign: "center" }}>
									<CircularProgress
										size="32px"
									/>
								</div>
							}
						</div>
					</div>
					<div
						role="tabpanel"
						hidden={this.state.currentTab !== 1}
					>
						<div style={{ padding: "8px 16px"}}>
							<TextField
								id="email"
								type="email"
								size="medium"
								required
								fullWidth
								label="Email"
								error={this.state.email.hasError}
								helperText={this.state.email.errorHelperText}
								onChange={(e) => this.handleInputChange(e, "email")}
								style={{ marginTop: "16px"}} />
							<TextField
								id="password"
								type="password"
								size="medium"
								required
								fullWidth
								label="Password"
								error={this.state.password.hasError}
								helperText={this.state.password.errorHelperText}
								onChange={(e) => this.handleInputChange(e, "password")}
								style={{ marginTop: "16px"}} />
							<div
								style={{textAlign:"center", marginTop: "32px"}}
							>
								<Button
									variant="contained"
									color="primary"
									size="large"
									disabled={!this.state.loginButton.isActive}
									onClick={(e) => this.login(e)}
								>
									Sign Up
								</Button>
							</div>
							{
								this.state.loginButton.isLoading && <div style={{ textAlign: "center" }}>
									<CircularProgress
										size="32px"
									/>
								</div>
							}
						</div>
					</div>
				</Grid>
				<Snackbar
					anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
					open={this.state.feedback.open}
					message={this.state.feedback.message}
					autoHideDuration={3000}
					onClose={this.handleFeedbackClose} />
			</Grid>
		);
    }
});

export default LoginView;

