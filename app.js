require("dotenv").config();
const express = require('express');
const bodyparser = require('body-parser');
const route = require('./Routes/routes');
var cors = require('cors');
const functions = require('firebase-functions')
// const requestLogger = require("./Utilities/requestLogger")

const app = express();
app.use(bodyparser.json());
// app.use(requestLogger)
app.use(cors());
// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });
app.use('/', route);
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

exports.api = functions.https.onRequest(app)