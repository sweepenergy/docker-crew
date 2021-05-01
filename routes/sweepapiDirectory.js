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

    app.get("/deleteDirectory", function(req,res){
        res.render("deleteDirectory.ejs");
    });
    
    app.get("/deleteDirectory/:id", async function(req,res){
        const TempId = req.params.id;
        console.log(TempId);
    
        // username: process.env.AUTH_KEY,
        // password: process.env.AUTH_TOKEN
        var username1 = process.env.AUTH_KEY
        var password1 = process.env.AUTH_TOKEN
        
    
    
        const token = Buffer.from(`${username1}:${password1}`, 'utf8').toString('base64')
        
        try{
            const resp = await axios.delete(sweepAPI.url + "directory/" + TempId,{
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': `Basic ${token}`
                }
            })
            
            console.log(resp.data)
            res.redirect("/");
            
    
        }catch(e){
            console.log(e);
        }
            
    
    
    });


    // // Delete directory given streamID
    // app.get("/deleteDirectory:id", function(req, res){

    //     var directoryID = req.params.id;

    //     console.log(directoryID);

    //     axios.delete(sweepAPI.url + 'directory/' + directoryID, sweepAPI.config).then(function(response){
    //             console.log(response);
    //             console.log (req.params);
                
    
    //         }).catch(function(error){
    //             console.log(error);
    //         });
    
    //     // return user to homepage
    //     res.redirect("/");
        
    // });

    
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