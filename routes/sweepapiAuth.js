// Pull sweepAPI const variables from info from .env file
const auth_key = process.env.AUTH_KEY;
const auth_token = process.env.AUTH_TOKEN;

// export api key, token, and base url
module.exports = {

    getKey: () => {
        return auth_key;
    },
    
    getToken: () => {
        return auth_token;
    },

    config: {

        headers: {
            'Content-Type': 'application/json',
            'data-raw': ''
        },
                    
        auth:{
            username: auth_key,
            password: auth_token
        }
    },
    
    url: 'https://api.sweepapi.com/'
    
};