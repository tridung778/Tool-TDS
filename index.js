var axios = require('axios');
var qs = require('qs');
var data = qs.stringify({

});
var config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://traodoisub.com/api/?fields=profile&access_token={{TDS_token}}',
    headers: {},
    data: data
};

axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
