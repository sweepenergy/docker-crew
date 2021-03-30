require('dotenv').config()
const express = require("express");
const app = express();
const axios = require('axios')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://testing_123:testing_123@sweeptest.x4jho.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
   useNewUrlParser: true,
   useUnifiedTopology: true
}, function(error){
    if(error){
        console.log(error);
    }else{
        console.log("connected to the database");
    }
});

// schema -> model -> collection
var streamSchema = new mongoose.Schema({
    var_name: String,
    display_name: String,
    description: String,
    units: String,
    type: String
});


var Stream = mongoose.model("Stream", streamSchema);


// Stream.create({
    
//         var_name: "current_r",
//         display_name: "R Current",
//         description: "residual current",
//         units: "amps",
//         type: "number"
    
// }, function(error,data){
//     if(error){
//         console.log("There was a problem adding an element to collection")
//         console.log(error);
//     }else{
//         console.log("Data added to collection");
//         console.log(data);
//     }
// })

// Stream.find({}, function(error,data){
//     if(error){
//         console.log("There was a problem finding data")
//         console.log(error);
//     }else{
//         console.log("Here is data from collection");
//         console.log(data);
//     }
// })


//looking for static files inside public
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


app.get("/", function(req,res){

    axios.get(baseURL + "directory/home", config).then(function(response){
        res.render("homepage", {
            homeDirectory: response.data
        });


    }).catch(function(error){
        console.log("This is the error" + error);
    });
    // res.render("homepage.ejs");
})

app.get("/info", function(req,res){
    res.render("info.ejs");
});

app.get('/login', function(req, res, next) { 


    axios.get(baseURL + "account/verify_auth", config).then(function(response){
        res.render("directories", {
            homeDirectory: response.data
        });


    }).catch(function(error){
        console.log("This is the error" + error);
    });

    res.render('login.ejs');
}); 

app.get('/list', function(req,res){
    
    Stream.find({}, function(error,streams){
        if(error){
            console.log("There was a problem finding stream in database")
            console.log(error);
        }else{
            res.render('list.ejs',{
                currentList : streams
            });
        }
    });


    // res.render('list.ejs',{
    //     currentList : list
    // });

});

app.get("/search", function(req,res){
    res.render("search.ejs");
});

// const email = "jpotosme@ucmerced.edu";
// const password= "JakesTesting_209";

const headers = {
    'Content-Type': 'application/json',
    'data-raw': ''
}

const config = {
    headers: {
        'Content-Type': 'application/json',
        'data-raw': ''
    },
                
    auth:{
        username: process.env.AUTH_KEY,
        password: process.env.AUTH_TOKEN
    }
}


var baseURL = "https://api.sweepapi.com/";

app.get('/apis', function(req,res){

    // var searchTerm = req.query.searchterm;
    // var searchTerm = "ad9fe988-484d-43b4-83ce-4c7a8b10b6e8";
    // console.log(searchTerm);

    axios.get(baseURL + "account/auth/api_key/", {
        headers: {
            'Content-Type': 'application/json',
            'data-raw': ''
        },
                    
        auth:{
            username: process.env.AUTH_KEY,
            password: process.env.AUTH_TOKEN
        }
    }).then(function(response){
        res.render("apis", {
            ActiveAPIs: response.data
        });

        // console.log(response.status);
        // console.log("here");
        // console.log(response.data.active);

        // var res = response.data;
        // console.log("res:" + res);

        // for(i in response.data.active){
        //     var apiName = response.data.active[i].api_key;
        //     // console.log("in for loop")
        //     console.log("Active API Key: " + apiName);
        // }
        

    }).catch(function(error){
        console.log("This is the error" + error);
    });




    // res.render("apis.ejs");
});

app.get('/directories', function(req,res){

    axios.get(baseURL + "directory/home", config).then(function(response){
        console.log(response.data);
        res.render("directories", {
            homeDirectory: response.data
        });


    }).catch(function(error){
        console.log("This is the error" + error);
    });


});

const currentStreamID = "015e4205-1977-417c-9dc3-b3425feebea6";

app.get('/streams', function(req,res){

    axios.get(baseURL+"stream/"+currentStreamID, config).then(function(response){
        console.log(response.data);
        // res.render("streams",{
        //     streamIDs: response.data
        // });
    }).catch(function(error){
        console.log("This is the error" + error);
    });
    
    res.render("streams.ejs");
});

const localStreams = [];
// console.log(localStreams);

function handleSubmit(){
    const id = document.getElementById("id").value;
    localStorage.setItem("CurrentStreamID", id);

    return;
}


app.get('/streamData', function(req,res){

    console.log(res);
    // axios.get(baseURL+"stream/"+currentStreamID, config).then(function(response){
    //     console.log(response.data);
    //     // res.render("streams",{
    //     //     streamIDs: response.data
    //     // });
    // }).catch(function(error){
    //     console.log("This is the error" + error);
    // });

    //SD = STREAM DATA 
    

    res.render("streamData.ejs", {SD:localStreams});
})

app.post("/streamData", function(req,res){
    var currentStreamID = req.body;

    console.log(currentStreamID);
})

//THIS WORKS
// axios.post("https://api.sweepapi.com/account/auth/api_key",{
//     "global_auth" : ["get","post"],
//     "local_auth" : ["get.stream","get.directory"],
//     "ttl":"",
//     "name":"My Test with axios"
// }, {
//     headers: {
//                 'Content-Type': 'application/json',
//                 'data-raw': ''
//             },
        
//             auth:{
//                 username: process.env.AUTH_KEY,
//                 password: process.env.AUTH_TOKEN
//             }
// }).then(function(response){
//     console.log(response.data);
//     console.log(response.data.session_api_token);
//     console.log(response.data.session_api_id);

// }).catch(function(error){
//     console.log(error);
// })

// axios.delete("https://api.sweepapi.com/account/auth/api_key/{ad9fe988-484d-43b4-83ce-4c7a8b10b6e8}",{
//     headers: {
//         'Content-Type': 'application/json',
//         'data-raw': ''
//     },

//     auth:{
//         username: process.env.AUTH_KEY,
//         password: process.env.AUTH_TOKEN
//     }
// }).then(function(response){
//         console.log(response.data);
        
    
//     }).catch(function(error){
//         console.log(error);
//     })

// var currentURL = "https://api.sweepapi.com/account/auth/api_key";

// axios.get(currentURL, {
//     headers: {
//         'Content-Type': 'application/json',
//         'data-raw': ''
//     },
                
//     auth:{
//         username: process.env.AUTH_KEY,
//         password: process.env.AUTH_TOKEN
//     }
// }).then(function(response){
//     console.log(response.status);
//     console.log("here")
//     console.log(response.data.active);

//     // var res = response.data;
//     // console.log("res:" + res);

//     for(i in response.data.active){
//         var apiName = response.data.active[i].api_key;
//         // console.log("in for loop")
//         console.log("Active API Key: " + apiName);
//     }
    

// }).catch(function(error){
//     console.log("This is the error" + error);
// });


// const instance = axios.create({
//     baseURL: 'https://api.sweepapi.com',
//     timeout: 1000,
//     headers : {
//         'Content-Type': 'application/json',
//         'data-raw': ''
//     },
//     auth: {
//         email: "jpotosme@ucmerced.edu",
//         password:"JakesTesting_209"
//     }
//   });

app.get("/addDirectory", function(req,res){
    res.render("addDirectory.ejs");
})

app.post("/addDirectory", async function(req,res){
    var dirData = req.body;
    console.log(dirData);


axios.post("https://api.sweepapi.com/directory",dirData, {
        headers: {
                    'Content-Type': 'application/json',
                    'data-raw': ''
                },
            
                auth:{
                    username: process.env.AUTH_KEY,
                    password: process.env.AUTH_TOKEN
                }
    })
    .then(function(response){
        console.log(response);
        

    }).catch(function(error){
        console.log(error);
    })
    
  
// createDir()  

res.redirect("/addDirectory");

});

app.get("/addStream", function(req,res){
    res.render("addStream.ejs");
})

app.post("/addStream", function(req,res){

    var streamData = req.body;
    console.log(streamData);

   

    axios.post(baseURL+ "stream", streamData,config)
    .then(function(response){
        console.log(response);
        

    }).catch(function(error){
        console.log(error);
    })

    res.redirect("/addStream")
});



app.get("/addDevice", function(req,res){
    res.render("addDevice.ejs");
});


app.post("/addDevice", function(req,res){
    var data = req.body;
    console.log(data);
    Stream.create({
        var_name: data.var_name,
        display_name: data.display_name,
        description: data.description,
        units: data.units,
        type: data.type
    }, function(error,data){
        if(error){
            console.log("There was a problem adding this device data");
        }else{
            console.log("added successfully");
            console.log(data);
        }
    })
    res.redirect("/list");
});

// app.post(baseURL+ "directory",{

// },{
//     headers: {
//         'Content-Type': 'application/json',
//         'data-raw': ''
//     },
                
//     auth:{
//         username: process.env.AUTH_KEY,
//         password: process.env.AUTH_TOKEN
//     }
// }, function(req,res){
//     var data = req.body;
//     console.log(data);
// });

app.get('/test', function(req,res){

    var searchTerm = req.query.searchterm;
    // var searchTerm = "ad9fe988-484d-43b4-83ce-4c7a8b10b6e8";
    console.log(searchTerm);

    axios.get(baseURL + "account/auth/api_key/" + searchTerm, {
        headers: {
            'Content-Type': 'application/json',
            'data-raw': ''
        },
                    
        auth:{
            username: process.env.AUTH_KEY,
            password: process.env.AUTH_TOKEN
        }
    }).then(function(response){
        res.render("test", {
            ActiveAPIs: response.data
        });

    }).catch(function(error){
        console.log("This is the error" + error);
    });




});


app.get("*", function(req,res){
    res.send("Error! route does not exist!");
})


app.listen(3000, function(req,res){
    console.log("Online!");
});