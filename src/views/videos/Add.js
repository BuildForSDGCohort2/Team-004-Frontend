import React from "react";
import createReactClass from "create-react-class";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import DropzoneComponent from "react-dropzone-component";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";

import $ from "jquery";

import AppConfig from "../../config";

var AddVideoView, AppEnv, dropZone, dropZoneConfig, dropZoneEventHandlers, dropZoneJSConfig;
AppEnv = AppConfig.get(AppConfig.get("environment"));

AddVideoView = createReactClass({
    viewName: "AddVideo",

    ajaxRequests: [],

    getInitialState(){
        var View, cachedState, state;
		View = this;
		
		cachedState = JSON.parse(window.sessionStorage.getItem(AppEnv.namespace+"_add_video_view_state"));
			
		state = {
            isTeacher: window.localStorage.getItem(AppEnv.namespace+"_user_role") === "teacher",
            url: {
                value: "",
                thumbnailUrl: "",
                hasError: false,
                errorHelperText: "",
                hasChanged: false
            },
            title: {
                value: "",
                hasError: false,
                errorHelperText: "",
                hasChanged: false
            },
            description: {
                value: "",
                hasError: false,
                errorHelperText: "",
                hasChanged: false
            },
            level: {
                value: "",
                hasError: false,
                errorHelperText: "",
                hasChanged: false
            },
            subject: {
                value: "",
                hasError: false,
                errorHelperText: "",
                hasChanged: false
            },
            language: {
                value: "",
                hasError: false,
                errorHelperText: "",
                hasChanged: false
            },
            country: {
                value: "",
                hasError: false,
                errorHelperText: "",
                hasChanged: false
            },
            postButton: {
				isActive: false
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

		if(!View.state.isTeacher){
            View.props.router.push("/");
        }

        dropZoneConfig = {
            paramName: "video",
            iconFiletypes: [".mp4"],
            showFiletypeIcon: false,
            postUrl: AppEnv.backendUrl + "/courses/upload" + "?token=" + window.localStorage.getItem(AppEnv.namespace+"_user_token")
        };

        dropZoneEventHandlers = {
            init(dropzone){
                dropzone.options.paramName = "video";
                dropZone = dropzone;
            },
            error(file, error, xhr){
                dropZone.removeFile(file);
                View.setState({
                    feedback: {
                        open: true,
                        message: "Upload failed! Retry"
                    }
                });
            },
            success(file, data){
                View.setState({
                    url: {
                        value: data.videoUrl,
                        thumbnailUrl: data.thumbnailUrl,
                        hasError: false,
                        errorHelperText: "",
                        hasChanged: true
                    },
                    feedback: {
                        open: true,
                        message: "File uploaded."
                    }
                }, function(){
                    View.validate();
                });
                dropZone.disable();
            },
            removedfile(file){
                if(dropZone.files.length === 0){
                    dropZone.enable();
                }
            }
        };

        dropZoneJSConfig = {
            thumbnailWidth: null,
            thumbnailHeight: null,
            addRemoveLinks: true,
            maxFiles: 1,
            acceptedFiles: "video/mp4",
            dictDefaultMessage: "Click or drop video file",
            dictInvalidFileType: "Only MP4 file",
            dictResponseError: "Uploading video error",
            dictCancelUpload: "Cancel",
            dictCancelUploadConfirmation: "Are you sure you want to cancel the video upload?",
            dictRemoveFile: "Remove"
        };
    },

    componentDidMount(){
        var View = this;
    },

    componentWillUnmount(){
        var View, i;
		View = this;

		for(i=0; i<View.ajaxRequests.length; i++){
			View.ajaxRequests[parseInt(i)].abort();
		}

		window.sessionStorage.setItem(AppEnv.namespace+"_add_video_view_state", JSON.stringify(View.state));
    },

    handleFeedbackClose(){
        this.setState({
            feedback: {
				open: false,
				message: ""
			}
		});
    },

    back(e){
        var View;

        View = this;

        View.props.router.goBack();
    },

    handleInputChange (e, id){
        var View, value, state;

        View = this;
        state = View.state;

        value = e.nativeEvent.target.value;

        switch(id){
            case "title":{
                state.title.value = value;
                state.title.hasChanged = true;
                if(value.length === 0){
                    state.title.hasError = true;
                    state.title.errorHelperText = "Value is required.";
                }else{
                    state.title.hasError = false;
                    state.title.errorHelperText = "";
                }
                break;
            }
            case "description":{
                state.description.value = value;
                state.description.hasChanged = true;
                if(value.length === 0){
                    state.description.hasError = true;
                    state.description.errorHelperText = "Value is required.";
                }else{
                    state.description.hasError = false;
                    state.description.errorHelperText = "";
                }
                break;
            }
            case "subject":{
                state.subject.value = value;
                state.subject.hasChanged = true;
                if(value.length === 0){
                    state.subject.hasError = true;
                    state.subject.errorHelperText = "Value is required.";
                }else{
                    state.subject.hasError = false;
                    state.subject.errorHelperText = "";
                }
                break;
            }
            case "level":{
                state.level.value = value;
                state.level.hasChanged = true;
                if(value.length === 0){
                    state.level.hasError = true;
                    state.level.errorHelperText = "Value is required.";
                }else{
                    state.level.hasError = false;
                    state.level.errorHelperText = "";
                }
                break;
            }
            case "language":{
                state.language.value = value;
                state.language.hasChanged = true;
                if(value.length === 0){
                    state.language.hasError = true;
                    state.language.errorHelperText = "Value is required.";
                }else{
                    state.language.hasError = false;
                    state.language.errorHelperText = "";
                }
                break;
            }
            case "country":{
                state.country.value = value;
                state.country.hasChanged = true;
                if(value.length === 0){
                    state.country.hasError = true;
                    state.country.errorHelperText = "Value is required.";
                }else{
                    state.country.hasError = false;
                    state.country.errorHelperText = "";
                }
                break;
            }
        }

        View.setState(state, function(){
            View.validate();
        });
    },

    validate(){
        var View, state, isValid;

        View = this;
        state = View.state;
        isValid = true;

        if(state.url.value.length === 0 || state.url.thumbnailUrl.length === 0){
            if(state.url.hasChanged) {
                state.url.hasError = true;
                state.url.errorHelperText = "Upload is required.";
            }
            isValid = false;
        }
        if(state.title.value.length === 0){
            if(state.title.hasChanged) {
                state.title.hasError = true;
                state.title.errorHelperText = "Value is required.";
            }
            isValid = false;
        }
        if(state.description.value.length === 0){
            if(state.description.hasChanged) {
                state.description.hasError = true;
                state.description.errorHelperText = "Value is required.";
            }
            isValid = false;
        }
        if(state.level.value.length === 0){
            if(state.level.hasChanged) {
                state.level.hasError = true;
                state.level.errorHelperText = "Value is required.";
            }
            isValid = false;
        }
        if(state.subject.value.length === 0){
            if(state.subject.hasChanged) {
                state.subject.hasError = true;
                state.subject.errorHelperText = "Value is required.";
            }
            isValid = false;
        }
        if(state.language.value.length === 0){
            if(state.language.hasChanged) {
                state.language.hasError = true;
                state.language.errorHelperText = "Value is required.";
            }
            isValid = false;
        }
        if(state.country.value.length === 0){
            if(state.country.hasChanged) {
                state.country.hasError = true;
                state.country.errorHelperText = "Value is required.";
            }
            isValid = false;
        }

        if(!isValid){
            if(state.title.hasChanged && state.description.hasChanged && state.level.hasChanged && state.subject.hasChanged && state.language.hasChanged && state.country.hasChanged) {
                state.feedback = {
                    open: true,
                    message: "Please check errors on form."
                };
            }
        }

        state.postButton.isActive = isValid;
        View.setState(state);
    },

    post(e){
        var View, request;

        View = this;

        if(View.state.postButton.isActive){
            View.setState({
                feedback: {
                    open: true,
                    message: "Processing..."
                }
            });

            request = $.ajax({
                url: AppEnv.backendUrl + "/courses" + "?token=" + window.localStorage.getItem(AppEnv.namespace+"_user_token"),
                cache: false,
                data: JSON.stringify({
                    title: View.state.title.value,
                    subject: View.state.subject.value,
                    level: View.state.level.value,
                    country: View.state.country.value,
                    description: View.state.description.value,
                    language: View.state.language.value,
                    thumbnailUrl: View.state.url.thumbnailUrl,
                    videoUrl: View.state.url.value
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
                    View.setState({
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
                    View.props.router.push("/videos/" + data._id+"/"+encodeURIComponent(View.state.title.value));
                }
            });

            View.ajaxRequests.push(request);
        }
    },

    render(){
        return (
			<Grid container className="c-add-video-view">
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="inherit" onClick={(e) => this.back(e)} >
                            <ArrowBackIcon/>
                        </IconButton>
                        <Typography variant="h6" style={{ flexGrow: 1 }}>Upload Video</Typography>
                        <Button color="inherit" disabled={!this.state.postButton.isActive} onClick={(e) => this.post(e)}>Post</Button>
                    </Toolbar>
                </AppBar>
				<Grid item xs={12}>
                    <Paper elevation={1} style={{ padding: "8px 16px"}}>
                        <div>
                            <div className="c-upload-dropzone">
                                <DropzoneComponent
                                    config={dropZoneConfig}
                                    eventHandlers={dropZoneEventHandlers}
                                    djsConfig={dropZoneJSConfig} />
                            </div>
                        </div>
                        <TextField
                            id="title"
                            size="medium"
                            required
                            fullWidth
                            label="Title"
                            error={this.state.title.hasError}
                            helperText={this.state.title.errorHelperText}
                            onChange={(e) => this.handleInputChange(e, "title")}
                            style={{ marginTop: "16px"}} />
                        <TextField
                            id="description"
                            size="medium"
                            multiline
                            required
                            fullWidth
                            label="Description"
                            error={this.state.description.hasError}
                            helperText={this.state.description.errorHelperText}
                            onChange={(e) => this.handleInputChange(e, "description")}
                            style={{ marginTop: "16px"}} />
                        <TextField
                            id="level"
                            size="medium"
                            required
                            fullWidth
                            label="Level"
                            error={this.state.level.hasError}
                            helperText={this.state.level.errorHelperText}
                            onChange={(e) => this.handleInputChange(e, "level")}
                            style={{ marginTop: "16px"}} />
                        <TextField
                            id="subject"
                            size="medium"
                            required
                            fullWidth
                            label="Subject"
                            error={this.state.subject.hasError}
                            helperText={this.state.subject.errorHelperText}
                            onChange={(e) => this.handleInputChange(e, "subject")}
                            style={{ marginTop: "16px"}} />
                        <TextField
                            id="language"
                            size="medium"
                            required
                            fullWidth
                            label="Language"
                            error={this.state.language.hasError}
                            helperText={this.state.language.errorHelperText}
                            onChange={(e) => this.handleInputChange(e, "language")}
                            style={{ marginTop: "16px"}} />
                        <TextField
                            id="country"
                            size="medium"
                            required
                            fullWidth
                            label="Country"
                            error={this.state.country.hasError}
                            helperText={this.state.country.errorHelperText}
                            onChange={(e) => this.handleInputChange(e, "country")}
                            style={{ marginTop: "16px"}} />
                    </Paper>
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

export default AddVideoView;

