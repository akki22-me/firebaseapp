var express = require('express');
var router = express.Router();
var db = require('../servicekey');


// add reecord //
router.post('/add_record',async(req,res)=>{
    try {

        var itemname = req.body.itemname;
        var itemprice = req.body.itemprice;
        var created_at = new Date();

        var docref = await db.collection('Item');
        var additem = docref.add({
            itemname:itemname,
            itemprice:itemprice,
            created_at:created_at
        });

        if(additem){
         res.status(200).json({
          message:'Item is add',
          status:true
         });
        }
        else{
            res.json({
            message:'Item not add',
            status:false
            });
        }

    } catch (error) {
        console.log(error)
       res.status(400).json({err:'err'})
    }
});

// get all items
router.get('/get_allitem',async(req,res)=>{

var itemarray = [];
    await db.collection('Item')
   .orderBy('created_at','desc')
    .get()
    .then(snap=>{
        snap.forEach(doc=>{
            itemarray.push({...doc.data(),id:doc.id})
        })
    
    if(itemarray.length > 0){
     res.status(200).json({
      message:'Item List Is',
      status:true,
      data:itemarray
     });
    }
    else{
        res.json({
         message:'No item list found',
         status:false
        });
    }
}).catch(err=>{
    console.log(err)
    res.status(400).json({Error:'err'})
})
});


///get single record

router.get('/get_single/:id?',async(req,res)=>{
    var id = req.params.id;
    if(!id){
        return res.json({
         message:'Id Is Missing',
         status:false
        });
    }
    await db.collection('Item').doc(id)
     .get()
     .then(function(doc){
        if(doc.exists){
            var detail = doc.data()
            res.status(200).json({
             message:'Detail Is',
             status:false,
             data:detail
            });
        }
        else{
             res.json({
              message:'Detail Not Found',
              status:false
             });
        } 
     });
     

});


//update data

router.post('/update_item/:id?',async(req,res)=>{
    try {
        var id = req.params.id;
        var price = req.body.price;

        if(!id){
            return res.json({
           message:'Is Is Required',
           status:false
            });
        }

       

        if(!price){
            return res.json({
           message:'price Is Required',
           status:false
            });
        }
        

        var ref =await db.collection('Item').doc(id)
        
        var up = ref.update({
            itemprice:price,
            update_at:new Date()
        });
        if(up){
        res.status(200).json({
          message:'Item Is Update',
          status:true
        });
        }
        else{
            res.status(200).json({
                message:'Item Is Not Update',
                status:false
              });
        }
        
    } catch (error) {
        console.log(error)
        res.status(400).json({err:'err'})
    }
});

router.delete('/delete_item/:id?',async(req,res)=>{
    try {
        var id = req.params.id;

        if(!id){
            return res.json({
           message:'Is Is Required',
           status:false
            });
        }


        var ref =await db.collection('Item').doc(id)
        
        var del = ref.delete();
        if(del){
        res.status(200).json({
          message:'Item Is Delete',
          status:true
        });
        }
        else{
            res.status(200).json({
                message:'Item Is Not Delete',
                status:false
              });
        }
        
    } catch (error) {
        console.log(error)
        res.status(400).json({err:'err'})
    }
});

module.exports = router;
