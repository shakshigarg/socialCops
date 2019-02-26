const functions = require('firebase-functions');
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
const admin = require('firebase-admin');
admin.initializeApp();
const express=require('express');
const crypto = require('crypto');
const database=admin.database();
const jwt=require('jsonwebtoken');
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


exports.hello = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


function loginBody(request,response)
{
	let username=request.body.username;
    let password=request.body.password;
    password= crypto.createHash('md5').update(password).digest('hex');
    console.log("uname "+username);
    console.log("pass "+password);

    let ref=database.ref();

    	 ref.once('value',function(snapshot){
        if(!snapshot.hasChild(`/${username}`)) {
            console.log("username does not exist");
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
      	// 	message: "data added success",
      	// })
      })
         .catch((err)=>{
         	return response.json({
      		message: "data not added",
      		})
         })
});

var Thumbnail = require('thumbnail');

exports.thumbnail = functions.https.onRequest((request, response) => {
	var thumbnail = new Thumbnail('C:/Users/Lenovo/Documents/SocialCops/functions/originals', 'C:/Users/Lenovo/Documents/SocialCops/functions/thumbnails');

	thumbnail.ensureThumbnail('1.jpg', 20, 20, function (err, filename) {
		if(err){
			return response.json({
	  		message: err
	  });
		}
	  console.log(filename);
	  return response.json({
	  		message: "done "
	  });
	});
});

var Jimp=require('jimp');

exports.thumb = functions.https.onRequest((request, response) => {
	Jimp.read('http://www.example.com/path/to/lenna.jpg')
  .then(image => {
  	console.log("done");
  	return response.json(image);
    // Do stuff with the image.
  })
  .catch(err => {
  	return response.json(err);
    // Handle an exception.
  });
});



// const app=express();
// app.use("/hii",hii);

// function hii(request,response){
// 	response.send("hii");
// }

// exports.api=functions.https.onRequest(app);

// var AuthenticationApi = require("mock-authentication-api")
// const netWorkLatency = 1000;
// const userStore = [
//     {id:1,username:'User1',password:'pass1'},
//     {id:2,username:'User2',password:'pass2'}
// ];

// AuthenticationApi.configure(netWorkLatency,userStore);

// // authenticating user
// AuthenticationApi.authenticate('abc','def').then(user => {
//     // no password field on user response
//     console.log(`${user.username} logged in`)
// }).catch(err => {
//     console.log(err);//Invalid User Credentials
// });


