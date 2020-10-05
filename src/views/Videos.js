import React from "react";
import createReactClass from "create-react-class";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import Snackbar from "@material-ui/core/Snackbar";
import Infinite from "react-infinite";
import ArrowBackIcon from "@material-ui/core/SvgIcon/SvgIcon";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import $ from "jquery";
import moment from "moment";

import AppConfig from "../config";

var VideosView, AppEnv, ListElement;
AppEnv = AppConfig.get(AppConfig.get("environment"));

ListElement = createReactClass({
	getInitialState(){
		var view, state;

		view = this;

		state = {
		    isExpired: null,
		};

		return state;
	},

    componentWillMount(){
        var view;
        view = this;
        view.getThumbnail(view.props.video);
    },

    getInsights(video){
		var view, insights;

		view = this;
		insights = [];
		//insights.push(video.views + " views");
		//insights.push(video.comments + " comments");
		//insights.push(video.downloads + " downloads");
		insights.push(moment(video.createdAt).fromNow());

		return insights.join(" - ");
	},

    getThumbnail(video){
        var view, urlParams, request;

        view = this;

        urlParams = {
        };
        if(window.localStorage.getItem(AppEnv.namespace+"_user_token") !== null){
            urlParams.token = window.localStorage.getItem(AppEnv.namespace+"_user_token");
        }

        request = $.ajax({
            url: AppEnv.backendUrl + "/courses/" + video._id + "/thumbnail",
            cache: false,
            data: urlParams,
            mimeType: "text/plain; charset=x-user-defined",
            error(xhr, status, error) {
                if(xhr.status === 200){
                    view.setState({
                        isExpired: false
                    });
                }else{
                    view.setState({
                        isExpired: true
                    });
                }
            },
            headers: {
            },
            method: "GET",
            success(data, status, xhr) {
                view.setState({
                    isExpired: false
                })
            }
        });

        view.props.parentView.ajaxRequests.push(request);
    },

    viewVideo(e, video){
        var view;

        view = this;

        view.props.parentView.props.router.push("/videos/"+video._id+"/"+encodeURIComponent(video.title));
	},

    render() {
		return (
			<ListItem>
				{this.state.isExpired===false &&
                    <Card style={{width: "100%", cursor: "pointer"}} onClick={(e) => this.viewVideo(e, this.props.video)}>
                        <CardMedia
                            image={AppEnv.backendUrl + "/courses/" + this.props.video._id + "/thumbnail"}
                            title={this.props.video.title}
                            style={{height:"320px"}}
                        />
                        <CardContent>
                            <Typography component="h2">{this.props.video.title}</Typography>
                            <Typography  component="p" variant="body2" color="textSecondary">{this.getInsights(this.props.video)}</Typography>
                        </CardContent>
                    </Card>
                }
                {this.state.isExpired===true &&
                    <Card style={{width:"100%"}}>
                        <CardContent>
                            <Typography component="h2">{this.props.video.title}</Typography>
                            <Typography  component="p" variant="body2" color="textSecondary">{this.getInsights(this.props.video)}</Typography>
                            <Typography  component="p" variant="body2" color="textSecondary">Content no longer available. Uploads are <a href="https://help.heroku.com/K1PPS2WM/why-are-my-file-uploads-missing-deleted" target="_blank"> deleted periodically</a> on Heroku. With a <a href="#/login">Teacher account</a> you can add more videos.</Typography>
                        </CardContent>
                    </Card>
                }
			</ListItem>
        );
	}
});

VideosView = createReactClass({
    viewName: "Videos",

    ajaxRequests: [],

    getInitialState(){
        var View, cachedState, state;
		View = this;
		
		cachedState = JSON.parse(window.sessionStorage.getItem(AppEnv.namespace+"_videos_view_state"));
			
		state = {
		    isConnected: window.localStorage.getItem(AppEnv.namespace+"_user_id") !== null,
		    isTeacher: window.localStorage.getItem(AppEnv.namespace+"_user_role") === "teacher",
            list: {
                isLoading: false,
                infiniteLoadBeginEdgeOffset: 180,
                query: "",
                limit: 4,
                skip: 0,
                items: [],
                elements: [],
				hasNext: true
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
    },

    componentWillUnmount(){
        var View, i;
		View = this;

		for(i=0; i<View.ajaxRequests.length; i++){
			View.ajaxRequests[parseInt(i)].abort();
		}

        View.state.list.elements = [];
		window.sessionStorage.setItem(AppEnv.namespace+"_videos_view_state", JSON.stringify(View.state));
    },

    handleFeedbackClose(){
        this.setState({
			feedback: {
				open: false,
				message: null
			}
		});
    },

    handleQueryChange (e){
        var View, value, listState;

        View = this;
        listState = View.state.list;
		
		listState = {
			isLoading: false,
			infiniteLoadBeginEdgeOffset: 180,
			query: e.nativeEvent.target.value,
			limit: 4,
			skip: 0,
			items: [],
			elements: [],
			hasNext: true
		};

        View.setState({
			list: listState
		});
    },

    loadVideos(e, query){
        var View, listState, urlParams, request;

        View = this;
        listState = this.state.list;

		if(listState.hasNext){
			listState.isLoading = true;
			this.setState({
				list: listState
			});

			urlParams = {
				limit: listState.limit
			};
			if(window.localStorage.getItem(AppEnv.namespace+"_user_token") !== null){
				urlParams.token = window.localStorage.getItem(AppEnv.namespace+"_user_token");
			}
			if(listState.skip !== 0){
				urlParams.skip = listState.skip;
			}
			if(listState.query.length !== 0){
				urlParams.query = listState.query;
			}

			request = $.ajax({
				url: AppEnv.backendUrl + "/courses",
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

					listState.isLoading = false;

					View.setState({
						list: listState,
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
					var i;

					for (i = 0; i < data.length; i++) {
						listState.elements.push(<ListElement key={data[parseInt(i)]._id} video={data[parseInt(i)]} parentView={View}/>);
					}

					listState.isLoading = false;

					listState.items = listState.items.concat(data);

					listState.skip = listState.items.length;
					
					listState.hasNext = (data.length!==0);
					
					View.setState({
						list: listState
					});
				}
			});

			View.ajaxRequests.push(request);
		}else{
			
		}
    },

    addVideo(e){
        var View;

        View = this;

        View.props.router.push("/add-video");
    },

    logout(e){
        var View;

        View = this;

        window.localStorage.removeItem(AppEnv.namespace+"_user_id");
        window.localStorage.removeItem(AppEnv.namespace+"_user_token");
        window.localStorage.removeItem(AppEnv.namespace+"_user_role");

        View.props.router.push("/");
    },

    render(){
        return (
            <Grid container className="c-videos-view">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" style={{ flexGrow: 1 }}>AfriTeach</Typography>
                        <div style={{ position: "relative", backgroundColor: "rgba(255, 255, 255, 0.15)", margin: "0 8px 0 16px", paddingRight: "32px" }}>
                            <InputBase
                                onChange={(e) => this.handleQueryChange(e)}
								style={{ width: "100%", color: "inherit", padding: "6px 6px 7px" }}
                                placeholder="Search..."
                            />
							<IconButton
								style={{ height: "100%", position: "absolute", top: "0", right: "0", pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center"}}
								color="inherit" 
								onClick={(e) => this.loadVideos(e, this.state.list.query)}
							>
								<SearchIcon />
							</IconButton>
                        </div>
						{!this.state.isConnected &&
                            <Button color="inherit" href="#/login">Login</Button>
                        }
                        {this.state.isConnected &&
                            <Button color="inherit" onClick={(e) => this.logout(e)}>Logout</Button>
                        }
                    </Toolbar>
                </AppBar>
				<Grid item xs={12}>
                    <List>
                        <Infinite
                            elementHeight={180}
                            useWindowAsScrollContainer={true}
                            infiniteLoadBeginEdgeOffset={this.state.list.infiniteLoadBeginEdgeOffset}
                            onInfiniteLoad={(e) => this.loadVideos(e)}
                            loadingSpinnerDelegate={
                                this.state.list.isLoading && <div style={{ textAlign: "center" }}>
									<CircularProgress
										size="32px"
									/>
								</div>
                            }
                            isInfiniteLoading={this.state.list.isLoading}
                        >
                            {this.state.list.elements}
                        </Infinite>
                    </List>
                    {this.state.isTeacher &&
                        <Fab size="medium" color="secondary" onClick={(e) => this.addVideo(e)} style={{ position: "fixed", bottom: 0, right: 0, margin: "16px"}}>
                            <AddIcon />
                        </Fab>
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

export default VideosView;

