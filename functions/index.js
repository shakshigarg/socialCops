const functions = require('firebase-functions');
const admin=require('firebase-admin');
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto=require('crypto');
const jsonpatch=require('jsonpatch');
admin.initializeApp();
const database=admin.database();
const XMLHttpRequest=require('xmlhttprequest').XMLHttpRequest;
function loginBody(request,response)
{
  let username=request.post.username;
    let password=request.post.password;
    password= crypto.createHash('md5').update(password).digest('hex');
    let ref=database.ref();
    ref.once('value',function(snapshot){
    if(!snapshot.hasChild(`/${username}`)) {
        let err={
              error: "username does not exist"
            }
        return response.json(err);
    }
    });
    database.ref(`/${username}/`).on('value', function(snapshot) {
        snapshot.forEach(function(childSnap) {
          let passwordValue=childSnap.val();
          if(password===passwordValue)
          {
            let data={
                    username: username
                  }
                  const token=jwt.sign(data,'RSG',{ expiresIn:"12h"});
                  return response.json(token);
            }
            let err1={
                     error: "password is invalid"
                }
            return response.json(err1);
      })
    });
}

exports.login=functions.https.onRequest(function(request,response){
    loginBody(request,response);
})

exports.pathcing=functions.https.onRequest(function(request,response){
    let jsonObject=request.body.jsonObject;
    let jsonPatchObject=request.body.jsonPatchObject;
    patcheddoc = jsonpatch.apply_patch(jsonObject, jsonPatchObject);  
    console.log(patcheddoc);
    if(patcheddoc)
    {
        return response.json(patcheddoc);
    }
    let err1={
                error: err
             }
    return response.json(err1);
})

exports.register = functions.https.onRequest((request, response) => {
  let username=request.body.username;
    let password=request.body.password;
    let pass=crypto.createHash('md5').update(password).digest('hex');
    let path=`/${username}/`
    const ref=database.ref();

    ref.once('value',(snapshot)=> {
        if (snapshot.hasChild(path)) {
            return response.json({
              message:"user already registered! please login to continue",
            });
        }
       }).then((snap)=>{
         ref.child(path).set({
      password : pass
    })
  })

   
      .then((snap)=>{
        loginBody(request,response);
        // return response.json({
        //  message: "data added success",
        // })
      })
         .catch((err)=>{
          return response.json({
          message: "data not added",
          })
         })
});

var Jimp=require('jimp');
exports.th=functions.https.onRequest(function(request,response){
Jimp.read('https://www.w3schools.com/images/w3schools_green.jpg')
  .then(image => {
    console.log("hi")
    console.log(image)
    return response.json(image
      .resize(50, 50) // resize
      .quality(60) // set JPEG quality
      .greyscale() // set greyscale
      .write('C:/Users/Lenovo/Pictures/img/1.jpg'));
  })
  .catch(err => {
    console.log("here")
    return response.json(err);
  });
  
})
