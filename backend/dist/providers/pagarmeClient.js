import axios from 'axios';
export var basePagarme = axios.create({
    baseURL: 'https://api.pagar.me/core/v5/',
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Basic ' + Buffer.from('' + process.env.PAGARME_API_KEY + ':').toString('base64')
    }
});
//# sourceMappingURL=pagarmeClient.js.map