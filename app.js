const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const http = require('http');
const appConfig = require('./config/appConfig');
const logger = require('./app/libs/loggerLib');
const routeLoggerMiddleware = require('./app/middlewares/routeLogger.js');
const globalErrorMiddleware = require('./app/middlewares/appErrorHandler');
const mongoose = require('mongoose');
const morgan = require('morgan');
const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');
let client = redis.createClient(10390,'redis-10390.c13.us-east-1-3.ec2.cloud.redislabs.com');

client.auth('eilFri5AcurAXsEfInAU22zJts47xooD');
client.on('connect', () => {

    console.log("Redis connection successfully opened");

});



const libs = require('./app/libs/timeLib');

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(routeLoggerMiddleware.logIp);
app.use(globalErrorMiddleware.globalErrorHandler);

 app.use(express.static(path.join(__dirname, 'client')));

//  app.set('trust proxy', 1);

 app.use(RateLimit({
  
  store: new RedisStore({
   client:client
  })
  ,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}))



const modelsPath = './app/models';
const controllersPath = './app/controllers';
const libsPath = './app/libs';
const middlewaresPath = './app/middlewares';
const routesPath = './app/routes';

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    next();
});

//Bootstrap models
fs.readdirSync(modelsPath).forEach(function (file) {
  if (~file.indexOf('.js')) require(modelsPath + '/' + file)
});
// end Bootstrap models

// Bootstrap route
fs.readdirSync(routesPath).forEach(function (file) {
  if (~file.indexOf('.js')) {
    let route = require(routesPath + '/' + file);
    route.setRouter(app);
  }
});
// end bootstrap route

// calling global 404 handler after route

app.use(globalErrorMiddleware.globalNotFoundHandler);


app.use(function(req, res, next) {
  req.headers['if-none-match'] = 'no-match-for-this';
  next();    
});

// end global 404 handler

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

// socket io connection handler 
const socketLib = require("./app/libs/socketLib");
const socketServer = socketLib.setServer(server);



// start listening to http server
console.log(appConfig);
server.listen(appConfig.port);
server.on('error', onError);
server.on('listening', onListening);

// end server listening code


// socket io connection handler 
// const socketLib = require("./app/libs/socketLib");
// const socketServer = socketLib.setServer(server);


// end socketio connection handler



/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    logger.error(error.code + ' not equal listen', 'serverOnErrorHandler', 10)
    throw error;
  }


  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(error.code + ':port is already in use.', 'serverOnErrorHandler', 10);
      process.exit(1);
      break;
    default:
      logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10);
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  ('Listening on ' + bind);
  logger.info('server listening on port' + addr.port, 'serverOnListeningHandler', 10);
  let db = mongoose.connect(appConfig.db.uri,{ useMongoClient: true });
}

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});


/**
 * database connection settings
 */
mongoose.connection.on('error', function (err) {
  console.log('database connection error');
  console.log(err)
  logger.error(err,
    'mongoose connection on error handler', 10)
  //process.exit(1)
}); // end mongoose connection error

mongoose.connection.on('open', function (err) {
  if (err) {
    console.log("database error");
    console.log(err);
    logger.error(err, 'mongoose connection open handler', 10)
  } else {
    console.log("database connection open success");
    //console.log(libs.isSameDayAsToday(Date()))

    logger.info("database connection open",
      'database connection open handler', 10)
  }
  //process.exit(1)
}); // enr mongoose connection open handler



module.exports = app;
