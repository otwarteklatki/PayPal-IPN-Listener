const axios = require('axios');
const logger = require('./configs/logger');

const RECURRING_PAYMENT_TYPE = 'recurring_payment';
const COMPLETED_PAYMENT_STATUS = 'Completed';

module.exports = {
    async sendIpn(ipn) {
        if (ipn.payment_status === COMPLETED_PAYMENT_STATUS) {
            const donation = ipnToDonationObject(ipn);
            const json = JSON.stringify(donation);
            logger.info(`[${Date.now()}] Requesting to email ${JSON.stringify(ipn.payer_email)}`);
            axios.post('https://uk-sendgrid-api-main-uepvew4upa-ew.a.run.app/paypal', json, {
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json'
                }
            }).then((result) => {
                logger.info(`[${Date.now()}] Requested to email ${JSON.stringify(ipn.payer_email)}, result: ${JSON.stringify(result)}`);
                return result;
            }).catch((error) => {
                logger.error(`[${Date.now()}] Email service error: ${JSON.stringify(error)}`);
            });
        } else {
            logger.info(`[${Date.now()}] Not emailing ${JSON.stringify(ipn.payer_email)} because their payment hasn't completed.`);
            return { success: false };
        }
    },
    shouldSendEmails() {
        if (process.env.SENDGRID_API_SERVICE_KEY) {
            return true;
        }
        return false;
    },
};

function ipnToDonationObject(ipn) {
    return {
        donorFirstName: ipn.first_name,
        donorLastName: ipn.last_name,
        date: ipn.payment_date,
        email: ipn.payer_email,
        amount: ipn.mcgross,
        recurring: getRecurring(ipn),
        apiKey: getSendGridApiServiceKey(),
    };
}

function getRecurring(ipn) {
    return ipn.txn_type === RECURRING_PAYMENT_TYPE;
}

function getSendGridApiServiceKey() {
    return process.env.SENDGRID_API_SERVICE_KEY;
}
