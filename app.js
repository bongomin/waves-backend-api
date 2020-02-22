const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
require('dotenv').config();
const UserRouter = require('./routers/users/Users');

const app = express();

// creating database connections
mongoose.Promise = global.Promise
mongoose.connect(process.env.DATABASE,
   {
      useUnifiedTopology: true,
      useNewUrlParser: true
   },
   (err) => {
      if (err) {
         console.log('error in databse connections')
      } else {
         console.log('database connections have been successful...')
      }
   })

// body parser middleware
app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(bodyParser.json());



// user the Routers
app.use('/api', UserRouter)

const PORT = process.env.PORT || 500;
app.listen(PORT, () => {
   console.log(`application is running on ..${PORT}`);
})