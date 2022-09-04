var express = require('express');
var router = express.Router();
var db = require('../servicekey');
var firebase =require('firebase');

//multiple file upload 

router.post('/multiple_file_upload',(req,res)=>{

  if(!req.files){
    return res.json({
       messsage:'Profile Image Not Select',
       status:false         
    });
  }

  var imagearray=[];

  var finalfile = req.files.finalfile;
//   console.log(finalfile,'finalfile')

  for (let index = 0; index < finalfile.length; index++) {
     element = finalfile[index];
    //  console.log(element.mimetype,'element')
  
    

  var storage = firebase.storage();
  var storageRef = storage.ref();
 
    var metadata = {
      contentType: element.mimetype,
    };

    

    var uploadTask = storageRef.child(element.name).put(element.data, metadata);



    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot) => {
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
          messsage:' Image Not Upload',
          status:false,
          error:error
        });
      }, 
      () => {
        // Upload completed successfully, now we can get the download URL


        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log(downloadURL,'downloadURL')
      
          //console.log(imagearray,'imagearray')
    
    
        });
        

   });
    
  }
  
});


router.post('/multiple_file_upload-----',(req,res)=>{

    if(!req.files){
      return res.json({
         messsage:'Profile Image Not Select',
         status:false         
      });
    }
  
    var imagearray=[];
  
    var finalfile = req.files.finalfile;
  //   console.log(finalfile,'finalfile')
  
    for (let index = 0; index < finalfile.length; index++) {
       element = finalfile[index];
       uploadImageAsPromise(element)
       imagearray=element.length
    }

    function uploadImageAsPromise (imageFile) {
        return new Promise(function (resolve, reject) {
            var storage = firebase.storage();
  var storageRef = storage.ref();
         
            //Upload file
          //  var uploadTask = storageRef.put(imageFile);
    
          var metadata = {
            contentType: imageFile.mimetype,
          };

        
             var uploadTask = storageRef.child(imageFile.name).put(imageFile.data,metadata);



            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
              (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // console.log('Upload is ' + progress + '% done');
                // switch (snapshot.state) {
                //   case firebase.storage.TaskState.PAUSED: // or 'paused'
                //     console.log('Upload is paused');
                //     break;
                //   case firebase.storage.TaskState.RUNNING: // or 'running'
                //     console.log('Upload is running');
                //     break;
                // }
              }, 
              (error) => {
               return res.json({
                  messsage:' Image Not Upload',
                  status:false,
                  error:error
                });
              }, 
              () => {
                // Upload completed successfully, now we can get the download URL
        
        
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                //   console.log(downloadURL,'downloadURL')
              
                //  res.json({
                //     url:downloadURL
                //  })
                 
                var a=  downloadURL
                 console.log(a)

                 
               
               

                });

        
           });
            
            
        });
    }

    });


module.exports = router;









