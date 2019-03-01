const functions = require('firebase-functions');
const admin=require('firebase-admin');
const jwt = require('jsonwebtoken');
const crypto=require('crypto');
const jsonpatch=require('jsonpatch');
const cors = require('cors');
const express = require('express');
admin.initializeApp();
const database=admin.database();
var Jimp=require('jimp');
const bodyParser = require('body-parser');
const app = express();
app.use(cors({origin:true}))
app.use(bodyParser.urlencoded({extended:false}));
app.use(function(req,res,next) {

    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
    next()
})


app.use('/login',login)
app.use('/patching',authenticate,patching)
app.use('/register',register)
app.use('/generateThumbnail',authenticate,generateThumbnail)

function authenticate(request,response,next)
{
    if(request.body.accessToken === undefined || request.body.accessToken === '')
    {
        return response.json({error : true,location : "empty or undefined access token"})
    }

    let accessToken = request.body.accessToken;
    jwt.verify(accessToken,'RSG',(err,data)=>{
        if(err !== null)
        {
            return response.json({error : err,location : "falied to verify"})
        }
        else
        {         
            return next();
        }
    })
}

function loginBody(request,response)
{
    let username=request.body.username;
    let password=request.body.password;
    password= crypto.createHash('md5').update(password).digest('hex');
    let ref=database.ref();
    ref.once('value',function(snapshot){
    if(!snapshot.hasChild(`/${username}`)) {
        let err={
              bit: "1"
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
                  let reply={
                    accessToken: token,
                    bit: "3"
                  }
              return response.json(reply);
            }
            let err1={
                     bit: "2"
            }
            return response.json(err1);
      })
    });
}

function login(request,response){
    loginBody(request,response);
}

function patching(request,response){
    let jsonObject=JSON.stringify(request.body.jsonObject);
    let jsonPatchObject=JSON.stringify(request.body.jsonPatchObject);
    patcheddoc = jsonpatch.apply_patch(jsonObject, jsonPatchObject);  
    console.log(patcheddoc);
    if(patcheddoc)
    {
        return response.json({
          bit: "2",
          patcheddoc: patcheddoc
        });
    }
    else
    {
      return response.json({
        message: "error",
        bit : "1"
      })
    }
}

function register(request, response){  
    let username=request.body.username;
    let password=request.body.password;
    let pass=crypto.createHash('md5').update(password).digest('hex');
    let path=`/${username}/`
    const ref=database.ref();
    ref.once('value',(snapshot)=> {
        if(snapshot.hasChild(path)) {
            return response.json({
              bit: "4",
              message:"user already registered! please login to continue"
            });
        }
    }).then((snap)=>{
         ref.child(path).set({
            password : pass
    })
        return response.json(loginBody(request,response));
  })
         .catch((err)=>{
            return response.json({
              error : err
          })
         })
}


function generateThumbnail(request,response){
Jimp.read(request.body.imageURL)
  .then(image => {
    return response.json(image
      .resize(50, 50) // resize
      .quality(60) // set JPEG quality
      .greyscale() // set greyscale
      .write('D:/img.jpg'));
  })
  .catch(err => {
    console.log("here")
    console.log(err);
    return response.json(err);
  });
}

exports.api = functions.https.onRequest(app);