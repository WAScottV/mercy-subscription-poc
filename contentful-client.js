require('dotenv').load();
const contentful = require('contentful');

module.exports = contentful.createClient({
  space: process.env.SPACE_ID,
  environment: 'master',
  accessToken: process.env.CMA_ACCESS_TOKEN
});