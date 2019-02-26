const functions = require('firebase-functions');
const admin=require('firebase-admin');
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto=require('crypto');
const jsonpatch=require('jsonpatch');
admin.initializeApp();
const database=admin.database();

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

