const redis = require('redis');
const client = redis.createClient(); // this creates a new client

client.on('connect', () => console.log('connected'));
client.on('error', () => console.log('error'));