const express = require('express');
const mongoose = require('mongoose');
const router = express.Router()
require('../../models/Users');
const Users = mongoose.model('User');



// signup user and ecrypt - password in the model by hashing 
router.post('/users/register', async (req, res, next) => {
   let User = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      last_name: req.body.last_name
   }
   new Users(User).save()
      .then(newUser => {
         return res.json({ success: true, savedUser: newUser })
      })
      .catch(err => {
         console.log(err)
      }


      )
})

// login user
router.post('/users/login', (req, res) => {
   Users.findOne({ 'email': req.body.email }, (error, User) => {
      if (!User) {
         return res.json({ loginSucess: false, message: 'No user with such email into the syste' })
      }

      User.comparePassword(req.body.password, (error, isMatch) => {
         if (!isMatch) {
            return res.json({ LoginSuccess: false, message: "Wrong Password...." })
         }
         // generate Token
         User.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            // storing the cookie
            res.cookie('w_auth', user.token).status(200).json({
               loginSucess: true
            })

         })

      })

   })
})

module.exports = router;









