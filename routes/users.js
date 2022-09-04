var express = require('express');
var router = express.Router();
var db = require('../servicekey');
var firebase =require('firebase');



/// user firebase profile get

router.post('/user_profile_get',(req,res)=>{

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

if (user !== null) {
  const displayName = user.displayName;
  const email = user.email;
  const photoURL = user.photoURL;
  const emailVerified = user.emailVerified;
  const uid = user.uid;

  res.status(200).json({
    uid:uid,
    displayName:displayName,
    email:email,
    photoURL:photoURL,
    emailVerified:emailVerified
  });
}
else{
  res.json({
 message:'User Profile Not Get',
 status:false
  });
}

   
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
 

 
  
router.post('/user_profile_update',(req,res)=>{


  var email = req.body.email;
  var password = req.body.password;
  var displayName = req.body.displayName;
  var filename= req.files;

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
  if(!displayName){
    return res.json({
      message:"Name Is Required",
      status:false
    });
  }
  if(!req.files){
    return res.json({
       messsage:'Profile Image Not Select',
       status:false         
    });
    }
    var finalfile = req.files.profileImg;

    var storage = firebase.storage();
  var storageRef = storage.ref();
 
    var metadata = {
      contentType: finalfile.mimetype,
    };

    firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    
    const user = firebase.auth().currentUser;

    if(filename ==null){
      res.json({
       messsage:'Please Select Image',
       status:false
      });
    }
    else{
      if(filename.profileImg.mimetype !== 'image/png' && filename.profileImg.mimetype !== 'image/jpg' && filename.profileImg.mimetype !== 'image/jpeg'){  
        res.json({
          messsage:'Make sure the Image to be uploaded are in jpg, jpeg or png file format.',
         status:false
        });
        return false;
    }   

    var uploadTask = storageRef.child(finalfile.name).put(finalfile.data, metadata);
       
         
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
       return res.json({
          messsage:' Profile Is Not Update',
          status:false,
          error:error
        });
      }, 
      () => {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          user.updateProfile({
            displayName: req.body.displayName,
            photoURL: downloadURL
          }).then(() => {
           res.status(200).json({
             messsage:'Profile  Update',
             status:true
           });
          }).catch((error) => {
            console.log(error)
          res.json({
           messsage:'Profile Not Update',
           status:false
          });
          });  
        });
      });
  }
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
