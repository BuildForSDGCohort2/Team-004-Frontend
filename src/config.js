import React from "react";
import AppConfig from "react-global-configuration";

AppConfig.set({
    environment: "develop",
    develop: {
        namespace: "afriteach_develop",
	frontendUrl: "https://afriteachweb.herokuapp.com/",
	backendUrl: "https://afriteach.azurewebsites.net/"
    }
});

export default AppConfig;
