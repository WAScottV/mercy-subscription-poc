const contentful = require('./contentful-client');
require('dotenv').config();

contentful.createClient(process.env.SPACE_ID, process.env.ACCESS_TOKEN);
contentful.getEntries('subscriptionBundle')
    .then(response => console.log(JSON.stringify(
        response.includes.Entry.map(r => r.fields), undefined, 2)))
    .catch(e => console.log(e));