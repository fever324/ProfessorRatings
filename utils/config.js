"user strict";
if(process.env.NODE_ENV === 'test') {
  require('dotenv').config({path:'./env/test.env'})
} else {
  require('dotenv').config({path:'../env/dev.env'})
}

var secret = process.env.secret;
var DB = process.env.DB;

export {secret, DB};
