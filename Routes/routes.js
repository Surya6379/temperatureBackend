const express = require('express');

const routing = express.Router();
const tracker = require('../Controller/tracker');


routing.get('/users/:email', tracker.getDetails);

routing.post('/registerUser', tracker.registerUser);

routing.post('/loginUser', tracker.loginUser);

routing.post('/addDevice', tracker.addDevice);

routing.get('/getDevices/:userID', tracker.getDevices);

routing.post('/updateTemp', tracker.updateTemp);




module.exports = routing;