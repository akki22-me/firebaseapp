
var express = require('express');
var router = express.Router();
var db = require('../servicekey');

var firebase =require('firebase');

//get
router.get('/',function(req,res){
  res.render('index',{title:'Firebase Express'})
})




//create account with email and password 

router.post('/create_account',(req,res)=>{
  
  var email = req.body.email;
  var password = req.body.password;

  if(!email){
    return res.json({
    message:"Email is Required",
    status:false
    });
  }

  if(!password){
    return res.json({
      message:"Password Is Required",
      status:false
    });
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
   var uid= user.uid;
   var displayName = user.displayName
   var photoURL = user.photoURL;
   var email= user.email;
   var emailVerified=user.emailVerified;
  //  var createdAt = user.createdAt;
   
   console.log(uid,'uid');
   console.log(displayName,'displayName')
   console.log(photoURL,'photoURL');
   console.log(email,'email');
   console.log(emailVerified,'emailVerified')

   var adduser =  db.collection('users')
   var saveuser= adduser.add({
     uid:uid,
    email : email,

   })

    res.json({
      message:'Account Is Create',
      status:true,
      user:user
    });
   
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    res.json({
     message:"Account Not Create",
     errorMessage:errorMessage,
     errorCode:errorCode
    });
  });

});


/// user login email with password

router.post('/userlogin',(req,res)=>{
  
  var email = req.body.email;
  var password = req.body.password;

  if(!email){
    return res.json({
    message:"Email is Required",
    status:false
    });
  }

  if(!password){
    return res.json({
      message:"Password Is Required",
      status:false
    });
  }

  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;

    var emailVerified =user.emailVerified;
    if(emailVerified == true){
      var singinfo =user.stsTokenManager
      res.status(200).json({
     message:'User Login',
     status:true,
     data:user
      });
    }
    else{
      res.status(200).json({
     message:'User Email Not Verify Please Verify Your Account',
     status:false,
    
      });
    }
   

  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    res.json({
      message:"User Not Login",
      errorMessage:errorMessage,
      errorCode:errorCode
     });
  });


});


/// send email verification 
router.post('/send_email_verification',(req,res)=>{

  var email = req.body.email;
var passowrd = req.body.password;
  if(!email){
    return res.json({
     message:'Email Is Required',
     status:false
    });
  }

  firebase.auth().signInWithEmailAndPassword(email, passowrd)
  .then((userCredential) => {
    
    const user = firebase.auth().currentUser;


    user.sendEmailVerification()
  .then(() => {
   
    res.status(200).json({
    message:'Email is Send ',
    status:true,

    });

  })
})
.catch((error) => {
  var errorCode = error.code;
  var errorMessage = error.message;
  res.json({
    message:"User Not Login",
    errorMessage:errorMessage,
    errorCode:errorCode
   });
  });
  
});


/// forgot password

router.post('/forgot_password',(req,res)=>{
 
  var email = req.body.email;

  if(!email){
    return res.json({
    message:"Email Is Required",
    status:false
    });
  }

  firebase.auth().sendPasswordResetEmail(email)
  .then(() => {
   res.status(200).json({
     message:'Forgot Password Email Send',
     status:true
   });
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorCode = error.message;
    res.json({
  message:'Email Not Send',
  message2:errorCode,
  message3:errorCode
    });
  });

});



/// password update
router.post('/password_update',(req,res)=>{
    var email = req.body.email;
    var password = req.body.password; 
    var newpassword = req.body.newpassword;

    if(!email){
      return res.json({
       message:'Email Is Required',
       status:false
      });
    }
  
    if(!password){
   return res.json({
    message:'Enter Current password',
    status:false
   });
    }

    if(!newpassword){
      return res.json({
       message:'Enter New Message',
       status:false
      });
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      
      const user = firebase.auth().currentUser;
  
      user.updatePassword(newpassword).then(() => {
      
        res.status(200).json({
           message:'Password  Update',
           status:true
        });
      }).catch((error) => {
        console.log(error)
        res.json({
          message:"Password Not Update",
        status:false
         });
      });
     
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    res.json({
      message:"Current password Not Matched",
      errorMessage:errorMessage,
      errorCode:errorCode
     });
    });
    

});


/// delete a user

router.post('/user_delete',(req,res)=>{
  var email = req.body.email;
  var password = req.body.password; 

  if(!email){
    return res.json({
     message:'Email Is Required',
     status:false
    });
  }

  if(!password){
 return res.json({
  message:'Enter Current password',
  status:false
 });
  }


  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    
    const user = firebase.auth().currentUser;

    user.delete().then(() => {
      res.status(200).json({
      message:'User Is Delete',
      status:false
      });
    }).catch((error) => {
      console.log(error,'error')
      res.json({
        message:"User Not Delete",
        status:false
       });
    });
    
   
})
.catch((error) => {
  var errorCode = error.code;
  var errorMessage = error.message;
  res.json({
    message:"user Not Match Any Account",
    errorMessage:errorMessage,
    errorCode:errorCode
   });
  });
  

});


module.exports = router;
