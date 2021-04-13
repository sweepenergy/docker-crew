// require axios for promise based architecture 
const axios = require('axios');

// Routes for Sweep api calls
module.exports = function(app){

    // User can input or request sweep api authentication
    app.get('/setup', function(req, res){

        // render html from ./views/sweep_api_auth.ejs
        res.render('sweepAuth', {
            url: process.env.URL ,
            sweep_api:[process.env.AUTH_KEY, process.env.AUTH_TOKEN]
        });
    });
};


