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
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import ReactPlayer from "react-player";
import Divider from "@material-ui/core/Divider";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

import $ from "jquery";
import moment from "moment";

import AppConfig from "../../config";

var ViewVideoView, AppEnv;
AppEnv = AppConfig.get(AppConfig.get("environment"));

ViewVideoView = createReactClass({
    viewName: "AddVideo",

    ajaxRequests: [],

    getInitialState(){
        var View, cachedState, state;
		View = this;
		
		cachedState = JSON.parse(window.sessionStorage.getItem(AppEnv.namespace+"_view_video_view_state"));
			
		state = {
            videoId: this.props.params.videoId,
            videoTitle: decodeURIComponent(this.props.params.videoTitle),
			video: null,
			isLoading: false,
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

        if(View.state.videoId.length === 0){
            View.props.router.push("/");
        }
		
		View.load();
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

		window.sessionStorage.setItem(AppEnv.namespace+"_view_video_view_state", JSON.stringify(View.state));
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

    load(){
        var View, urlParams, request;

        View = this;

        urlParams = {
        };
        if(window.localStorage.getItem(AppEnv.namespace+"_user_token") !== null){
            urlParams.token = window.localStorage.getItem(AppEnv.namespace+"_user_token");
        }

		View.setState({
			isLoading: true
		});
		
        request = $.ajax({
            url: AppEnv.backendUrl + "/courses/" + View.state.videoId,
            cache: false,
            data: urlParams,
            contentType: "application/json",
			dataType: "json",
			error(xhr, status, error) {
				var response;
				if("responseText" in xhr) {
					response = JSON.parse(xhr.responseText);
				}else if("statusText" in xhr){
					response = xhr.statusText;
				}else{
					response = error;
				}

				View.setState({
					isLoading: false,
					feedback: {
						open: true,
						message: response.message
					}
				});
			},
            headers: {
            },
            method: "GET",
            success(data, status, xhr) {
                View.setState({
					isLoading: false,
					video: data
				});
            }
        });

        View.ajaxRequests.push(request);
    },

    render(){
        return (
			<Grid container className="c-view-video-view">
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="inherit" onClick={(e) => this.back(e)} >
                            <ArrowBackIcon/>
                        </IconButton>
                        <Typography variant="h6" style={{ flexGrow: 1 }}>{this.state.videoTitle}</Typography>
                    </Toolbar>
                </AppBar>
                <Grid item xs={12}>
					{this.state.video !== null &&
						<div>
							<div className="player-wrapper">
								<ReactPlayer
									className="react-player"
									url={AppEnv.backendUrl + "/courses/" + this.state.videoId + "/stream"}
									width="100%"
									height="100%"
									controls={true}
								/>
							</div>
							<Paper elevation={1} style={{ padding: "8px 16px"}}>
								<Typography component="h2">{this.state.video.title}</Typography>
								<Typography  component="p" variant="caption" color="textSecondary">{[moment(this.state.video.createdAt).fromNow()].join(" - ")}</Typography>
								<Typography  component="p" variant="body2" color="textSecondary">{this.state.video.description}</Typography>
								
								<Divider style={{ margin:"15px 0" }}/>

								<Typography variant="overline" display="block" gutterBottom><strong>Country</strong> {this.state.video.country} - <strong>Language</strong> {this.state.video.language} - <strong>Level</strong> {this.state.video.level} - <strong>Subject</strong> {this.state.video.subject}</Typography>
								<Button color="primary" startIcon={<CloudDownloadIcon />} href={AppEnv.backendUrl + "/courses/" + this.state.videoId + "/download"}>Download Video</Button>
							</Paper>
						</div>
					}
					{
						this.state.isLoading && <div style={{ textAlign: "center" }}>
								<CircularProgress
									size="32px"
								/>
							</div>
					}
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

export default ViewVideoView;

