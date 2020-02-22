const mongoose = require('mongoose');
const Schema = mongoose.Schema
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const SALT_I = 10;
require('dotenv').config()

const UsersModel = new Schema({
   email: {
      type: String,
      required: true,
      trim: true,
      unique: 1
   },
   password: {
      type: String,
      required: true,
      minLength: 5
   },
   name: {
      type: String,
      required: true,
      maxLength: 100
   },
   last_name: {
      type: String,
      required: true,
      maxLength: 100
   },
   cart: {
      type: Array,
      default: []
   },
   history: {
      type: Array,
      default: []
   },
   role: {
      type: Number,
      default: 0
   },
   token: {
      type: String
   }

})

// encrypting the normal password before saving password
UsersModel.pre('save', function (next) {
   var user = this;
   // check incase password is modified
   if (user.isModified('password')) {
      bcrypt.genSalt(SALT_I, function (err, salt) {
         if (err) return next(err);
         //  encrypt the password
         bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
         });
      })
   } else {
      next()
   }
})

// function for comparing the passwords
UsersModel.methods.comparePassword = function (candidatePassword, cb) {
   bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch)
   })
}


// fuction for creating a token
UsersModel.methods.generateToken = function (cb) {
   var user = this;
   var token = JWT.sign(user._id.toHexString(), process.env.SECRET)
   user.token = token;
   user.save(function (err, user) {
      if (err) return cb(err);
      cb(null, user);
   })
}

UsersModel.statics.findByToken = function (token, cb) {
   var user = this;
   JWT.verify(token, process.env.SECRET, function (err, decode) {
      user.findOne({ "_id": decode, "token": token }, function (err, user) {
         if (err) return cb(err);
         cb(null, user);
      })
   })
}


module.exports = mongoose.model('User', UsersModel);