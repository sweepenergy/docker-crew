//---IMPORT/REQUIRE NECESSARY MODULES HERE---//
const mongoose = require("mongoose");
const express = require("express")
const Directory = require('../models/directory.js');

//---ROUTES TO EXPORT---//


module.exports = function(app){

    mongoose.connect(process.env.URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(error){
        if(error){
            console.log(error);
        }else{
            console.log("connected to the database");
        }
    });



    //looking for static files inside public
    app.use(express.static(__dirname +"/public"));


    app.get('/dbHome', function(req,res){
        Directory.find()
        .then((result) =>{
            res.render("dbHome", {
                directories: result
            })
        })
        .catch((err) => {
            console.log(err);
        })

    });

    app.post('/dbHome', function(req,res){
        const directory = new Directory(req.body);

        directory.save()
            .then((result) => {
                res.redirect('/dbHome');
            })
            .catch((err) => {
                console.log(err);
            })

    });

    app.get("/dbAddDirectory", function(req,res){
        res.render("dbAddDirectory.ejs");
    })

    app.get("/dbHome/:id", function(req,res){
        const id = req.params.id;
        
        Directory.findById(id, function(err, docs){
            if(err){
                console.log(err);
            }
            // else if(id != "style.css"){
            else{
                console.log("result: ", docs);
                res.render('directoryDetails', {
                        directory: docs 
                    })
            }
        });

        // Directory.findById(id)
        //     .then(result=>{
                
        //         console.log("rendering data...");

        //         res.render('directoryDetails', {
        //             directory: result  
        //         })
        //     })
        //     .catch((err) =>{
        //         console.log(err);
        //     })
            
        console.log("Selected id: " + id);
    });

    //AJAX REQUEST
    app.delete('/dbHome/:id', function(req,res){
        const id = req.params.if;

        Directory.findByIdAndDelete(id)
            .then((result) => {
                res.json({ redirect: '/dbHome'})
            })
            .catch(err => console.log(err));
    });

};


