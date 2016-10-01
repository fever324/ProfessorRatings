"user strict";

if(process.env.NODE_ENV === 'test') {
  require('dotenv').config({path:'./env/test.env'})
} else {
  require('dotenv').config({path:'./env/dev.env'})
}
