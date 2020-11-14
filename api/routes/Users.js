const mongoose = require("mongoose");
const keys = require("../../config/keys");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken")
const passort = require("../../config/passport");
const Users = require('../../models/Users');
const validators = require("../../validation/validators");
const loginValidator = validators.loginValidator;
const registerValidator = validators.registerValidator;
const express = require("express");
const router = express.Router();

router.post('/register',(req,res) => {
    //console.log(req.body)
    const { errors, isValid } = validators.registerValidator(req.body);
    if(!isValid){
        res.status("400").json(errors);
    }
    Users
    .findOne({email: req.body.email})
    .then((user) =>{
        if(user){
             res.status(404).json({"email":"Email ID already exists!"});
        }
        else{
            const registerUser = new Users({
                name: req.body.name,
                email: req.body.email,
                role:req.body.role,
                desc:req.body.desc,
                number:req.body.number,
                password: req.body.password
            })
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(registerUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  registerUser.password = hash;
                  registerUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                });
              });
        }
    })
   // res.send(errors);
});

router.post('/login',(req,res)=>{
    const  {errors, isValid } = validators.loginValidator(req.body);
    if(!isValid){
        res.status(400).json(errors);
    }
    Users.findOne({"email": req.body.email})
    .then((user) =>{
        if(!user) res.status(400).json({"email":"Email doesn't exist!"});
        bcrypt
        .compare(req.body.password,user.password)
        .then((isMatch)=>{
            if(!isMatch) res.status(400).json({"password":"Incorrect password provided!"});
            else{
                const payload={
                    id:user.id,
                    name:user.name
                }
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn:31556926
                    },
                    (err,token) =>{
                        res.json({
                            success:true,
                            token:"Bearer "+token
                        });
                    }
                );
            }
        })
    })
});
module.exports = router;