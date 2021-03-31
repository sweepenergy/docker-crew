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
