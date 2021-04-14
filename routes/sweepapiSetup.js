//---IMPORT/REQUIRE NECESSARY MODULES HERE---//
// require axios for promise based architecture 
const axios = require('axios');

// import sweepAuth module Sweep API Authentication from env variables + sets api base url
const sweepAPI = require('./sweepapiAuth');


//---ROUTES TO EXPORT---//
module.exports = function(app){

    // User can input or request sweep api authentication
    app.get('/setup', function(req, res){

        //TODO: 
        // Get auth key and token using email + password for Sweep API
        res.redirect('/login');
        // Write auth key and token to .env file

        // STREATCH GOALS: 
        // - save auth key and token to local database
        // - create account endpoint

        // render html from ./views/sweep_api_auth.ejs
        res.render('sweepAuth', {
            url: process.env.URL ,
            sweep_api:[process.env.AUTH_KEY, process.env.AUTH_TOKEN]
        });
    });

    // Display UI for SweepAPI login
    app.get('/login', function(req,res){
        res.render("login");
    });

    //Get api token and key from existing Sweep API account
    app.get('/login', function(req, res, next) { 

        axios.get(sweepAPI.url + "account/verify_auth", sweepAPI.config).then(function(response){
            res.render("directories", {
                homeDirectory: response.data
            });
    
    
        }).catch(function(error){
            console.log("Error:" + error);
        });
        
        //return user to homepage
        res.render('/');
    }); 

    //--STREATCH GOAL--/
    app.get('/createAccount', function(req, res){
        res.render('newAccount');
    });

    app.post('/createAccount', function(req, res){

        console.log(req.body);

        axios.post(sweepAPI.url + "account/auth/api_key", req.body, sweepAPI.config)
            .then(function(response){
                console.log(response);
    
            }).catch(function(error){
                console.log(error);
            })
    
        // return user to homepage
        res.redirect("/");
    });

    app.get('/apis', function(req,res){

        axios.get(sweepAPI.url + "account/auth/api_key/", sweepAPI.config).then(function(response){
            res.render("apis", {
                ActiveAPIs: response.data
            });
            
    
        }).catch(function(error){
            console.log("This is the error" + error);
        });
    
        // res.render("apis.ejs");
    });


};


