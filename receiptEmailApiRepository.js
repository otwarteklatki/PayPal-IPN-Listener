var axios = require('axios');

module.exports = {
    async sendIpn(ipn) {
        const json = JSON.stringify(ipn);
        return await axios.post('https://httpbin.org/post', json, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
};
