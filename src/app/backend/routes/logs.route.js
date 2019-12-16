const express = require('express');
const app = express();
const logRoute = express.Router();

// Employee model
let Log = require('../models/Log');

// Get All Logs
logRoute.route('/').get((req, res) => {
    Log.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

// Add log
logRoute.route('/create').post((req, res, next) => {
    console.log(req.body);
    Log.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

module.exports = logRoute;