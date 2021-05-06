//require axios for sweep api call
const axios = require('axios');

//Define sweep api url & config header for api requests
const API_URL = 'https://api.sweepapi.com/';
var authHeader;

//Define sweep api json response for valid responses
const validSweepResponse = {status : 'ok'};

//Function checks if auth information is valid and sets the header & authkey/token for api requests if it is valid
var validateAuth = async (authKey, authToken) => {
    //Check if authkey and token are defined
    if(!(authKey || authToken)){
        //returns false if authkey or token are undefined
        console.log("Api authentication key or token was undefined.");
        return false;
    }
    
    //Create temp header for trying sweepAPI request
    var trialConfig = {
        headers: {
            'Content-Type': 'application/json',
            'data-raw': ''
        },       
        auth:{
            username: authKey,
            password: authToken
        }
    };

    //Test authkey and authToken by making get request to sweep api
    const response = axios.get(API_URL + "account/verify_auth", trialConfig).then(function(response){

        //Check if API returns valid status
        if (response.data.status == validSweepResponse.status){
            //set trialConfig header to sweepAPI.config if valid
            console.log("Valid api auth. Setting new authinfo...")
            authHeader = trialConfig;
            return true;
        }

        //Print that authToken was invalid and return false
        console.log("Api token or key were invalid.")
        return false;

    }).catch(function(error){

        //Print error if sweep API request fails
        console.log("Error:" + error);
        return false;
    });

    return response;
};

//--EXPORTED VARIABLES & FUNCTIONS --//
module.exports = {
    //Function to validate & set api token and key
    validateAuth: validateAuth,

    //Return what authKey is used in api requests
    getKey: () => {
        if(authHeader) return authHeader.auth.username;
    },
    
    getToken: () => {
        if(authHeader) return authHeader.auth.password;
    },

    config: ()=> {
        return authHeader;
    },
    
    url: API_URL
    
};