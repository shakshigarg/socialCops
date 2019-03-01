var accessToken=localStorage.getItem('accessToken');
// var count=localStorage.getItem('count');

function login(result){
  var message="";
  if(result.bit=="1"){
    message="username does not exit"
  }
  else if(result.bit=="2"){
    message="password is invalid"
  }
  else{
    localStorage.setItem('accessToken',result.accessToken);
      window.location="./main.html";
  }
  var ref=document.getElementById('mes');
  var val="<p><b>"+message+"</b></p>"
  ref.innerHTML=ref.innerHTML+val;
  alert(accessToken);
}

function register(result){
  var message="";
  if(result.bit=="4"){
    message="Already have an account! login to continue"
  }
  else{
     localStorage.setItem('accessToken',result.accessToken);
      window.location="../html/main.html"; 
}
}

function patching(result){
  var message="";
  if(result.bit=="1"){
    message="invalid Json input";
    var ref=document.getElementById('message');
    var val="<p><b>"+message+"</b></p>";
    ref.innerHTML=ref.innerHTML+val;
  }
  else{
      var ref=document.getElementById('jsonDoc');
      var val=JSON.stringify(result.patcheddoc);
      ref.innerHTML=ref.innerHTML+val;
  }
}

function generateThumbnail(result){
      var ref=document.getElementById('resize');
      ref.style.display="block";
      window.location.href="#resize";
      // if(localStorage.getItem('count') === null)
      // {
      //   count=1;
      // }
      // else
      // {
      //    count=count+1;
      // }
      // alert(count);
      // localStorage.setItem('count',count);
      ref=document.getElementById('imgsave');
      var val='<img src="D:/img.jpg"><br><br>';
      ref.innerHTML=ref.innerHTML+val;
}

function signout(){
  // localStorage.removeItem('accessToken');
   localStorage.clear();
  alert(accessToken);
  // alert(count);
  window.location.href="../html/index.html";
}


$(document).ready(function(){
                $(".sign").click(function(){
                        var username=document.getElementById("username").value;
                        var password=document.getElementById("password").value;

                        $.post("https://us-central1-socialcops-40791.cloudfunctions.net/api/login",
                        {
                            username : username,
                            password : password
                        },

                        function(result)
                        {
                            console.log(result);
                            login(result);
                        });


                       

                 });


                  $(".signup").click(function(){
                        var username=document.getElementById("username").value;
                        var password=document.getElementById("password").value;

                        $.post("https://us-central1-socialcops-40791.cloudfunctions.net/api/register",
                        {
                            username : username,
                            password : password
                        },

                        function(result)
                        {
                            console.log(result);
                            register(result);
                        });


                       

                 });

                  $(".applyPatch").click(function(){
                        var jsonObject=document.getElementById("jsonObject").value;
                        var jsonPatchObject=document.getElementById("jsonPatchObject").value;

                        $.post("http://localhost:5000/socialcops-40791/us-central1/api/patching",
                        {
                            jsonObject : jsonObject,
                            jsonPatchObject : jsonPatchObject,
                            accessToken: accessToken
                        },

                        function(result)
                        {
                            console.log(result);
                            patching(result);
                        });


                       

                 });

                 $(".generateThumbnail").click(function(){
                        var imageURL=document.getElementById("imageURL").value;
                        $.post("https://us-central1-socialcops-40791.cloudfunctions.net/api/generateThumbnail",
                        {
                            imageURL: imageURL,
                            accessToken: accessToken,
                            // count: count+1
                        },

                        function(result)
                        {
                            console.log(result);
                            generateThumbnail(result);
                        });
                 });

});
