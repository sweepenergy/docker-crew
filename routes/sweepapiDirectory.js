//---IMPORT/REQUIRE NECESSARY MODULES HERE---//
// require axios for promise based architecture 
const axios = require('axios');

// import sweepAuth module Sweep API Authentication from env variables + sets api base url
const sweepAPI = require('./sweepapiAuth');


//---ROUTES TO EXPORT---//
module.exports = function(app){

    // Display UI page for adding directory
    app.get("/addDirectory", function(req,res){
        res.render("addDirectory");
    });

    // Post request to api when submit pressed
    app.post("/addDirectory", function(req, res){

        var dirData = req.body;
        //console.log(dirData);
        
        axios.post(sweepAPI.url + "directory", dirData, sweepAPI.config)
            .then(function(response){
                console.log(response);
    
            }).catch(function(error){
                console.log(error);
            })
    
        // return user to homepage
        res.redirect("/");
        
    });

    // Delete directory given streamID
    app.get("/deleteDirectory", function(req, res){

        //TODO: Pass directoryID from Frontend
        var directoryID = "fcc9aca4-7004-4f8c-8a4a-f31a7df2e915";
        console.log(req.params);

        axios.delete(sweepAPI.url + 'directory/' + directoryID, sweepAPI.config).then(function(response){
                console.log(response);
                console.log (req.params);
                
    
            }).catch(function(error){
                console.log(error);
            });
    
        // return user to homepage
        res.redirect("/");
        
    });

    
    app.get('/directories', function(req,res){

        axios.get(sweepAPI.url + "directory/home", sweepAPI.config).then(function(response){
            console.log(response.data);
            res.render("directories", {
                homeDirectory: response.data
            });
    
    
        }).catch(function(error){
            console.log("This is the error" + error);
        });
    
    
    });
    
    
    app.get('/directoryData/:id', function(req,res){
        const id = req.params.id;
        console.log(id);
        
    
        axios.get(sweepAPI.url +"directory/" + id, sweepAPI.config).then(function(response){
            console.log(response.data);
            res.render("directoryData", {
                dirData: response.data
            })
        }).catch( function(error){
            console.log(error);
        })
        
    
        // res.render("streamData.ejs", {SD:localStreams});
    })
    
}