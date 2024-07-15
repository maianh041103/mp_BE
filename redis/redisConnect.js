'use strict';

const redis = require("redis");
const config = require("../config/default.json");

const client = redis.createClient({
    username: config.redis.username,
    password: config.redis.password,
    socket: {
        host: config.redis.host,
        port: config.redis.port,
        tls: false,
    },
    connectTimeout: 10000 // in milliseconds
});
client.on('error', err => console.log('Redis Client Error', err));
module.exports = { client };
