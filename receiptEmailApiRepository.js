const axios = require('axios');

module.exports = {
    async sendIpn(ipn) {
        const json = JSON.stringify(ipn);
        return axios.post('https://httpbin.org/post', json, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    },
};
