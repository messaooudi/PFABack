
var express = require('express');
var async = require('async')
var mongoose = require('mongoose');
var databaseModels = require('./databaseModels')




var router = express.Router();

//{intitulee : String,userId : _id,targetUsers : [{id : _id,permision : "r|w"}]}
router.post("/creeEmodule",function(req,res){
       console.log(req.connection.remoteAddress+" requested "+req.path);
       console.log("request is : "+JSON.stringify(req.body,null));
       res.setHeader('Content-Type', 'application/json');
       //connection a la base de donnée
       var db = mongoose.connection; 
       mongoose.connect('mongodb://localhost:27017/test');
       
       db.on('error',function(){
                 console.log(JSON.stringify({code : '001',message :"connection to database faild"}));
                 res.send(JSON.stringify({code : '001',message :"connection to database faild"}));
                 mongoose.connection.close();
       });
       
       db.once('open',function(){
           console.log("connection to database ");
           console.log("response is : ");
           async.waterfall([
               function(callback){
                   databaseModels.eModules.find({intitulee : req.body.intitulee},function(err,doc){
                       if(err) return callback({code : '002',message:"database problem!"})
                       if(doc.length>0) return callback({code : '003',message : "Intitulee taken !!"});
                       callback(null);
                   });  
               },
               function(callback){
                   var eModule = new databaseModels.eModules({
                                        intitulee : req.body.intitulee,
                                        createdBy : req.body.userId,
                                        sendTo : req.body.targetUsers,
                                        creationDate : new Date(),
                                        lastUpdate : new Date(),
                                        updatedBy : req.body.userId});
                   eModule.save(function(err){
                       if(err) return callback({code : '002',message :"database problem!"});
                       callback(null,eModule._id);
                   });
               },
               function(eModuleId,callback){
                   async.each(
                           req.body.targetUsers,
                           function(element,callback){
                               databaseModels.profs.findById(element.id,function(err,prof){
                               if(!err&&prof){
                                   prof.addNotif({
                                       eModule : eModuleId,
                                       permision : element.permision,
                                       status : "unseen",
                                       date : new Date() 
                                   });
                                   prof.save(function(err){
                                       callback(null);
                                   });
                                 }
                               });
                           },
                           function(err){
                               callback(null,null);
                           }) 
               }
           ],
           function(err,data){
               if(err){ 
                    res.send(JSON.stringify(err,null,'\t'));
                    console.log(JSON.stringify(err,null,'\t'))
               }
               else{
                    res.send(JSON.stringify({code : "200",message:"",data : data},null,'\t'));
                    console.log(JSON.stringify({code : "200",message:"",data : data},null,'\t'))
               }
               console.log("connection to database closed"); 
               mongoose.connection.close();
           }
           )
       });
});

//{userId : id,eModuleId : _Id,targetUsers : [{id : _id,permision : "r|w"}]}
router.post("/shareEmodule",function(req,res){
       res.setHeader('Content-Type', 'application/json');
       
       //connection a la base de donnée
       var db = mongoose.connection; 
       mongoose.connect('mongodb://localhost:27017/test');
       
       db.on('error',function(){
                 console.log(JSON.stringify({code : '001',message :"connection to database faild"},null));
                 res.send(JSON.stringify({code : '001',message :"connection to database faild"}));
                 mongoose.connection.close();
       });
       
       db.once('open',function(){
           console.log("connection to database ");
           console.log("response is : ");
           async.series([
               function(callback){
                   databaseModels.eModules.findById(req.body.eModuleId,function(err,eModule){
                       if(err) return callback({code : '002',message :"database problem!"});
                       if(!eModule) return callback({code : '004',message :"eModule doesn't exist!!"})
                           eModule.appendSendTo(req.body.targetUsers);
                           eModule.save(function(err){
                               if(err) return callback({code : '002',message :"database problem!"},null);
                               callback(null,null);
                           });
                   });
               },
               function(callback){
                   async.each(
                           req.body.targetUsers,
                           function(element,callback){
                               databaseModels.profs.findById(element.id,function(err,prof){
                               if(!err&&prof){
                                   prof.addNotif({
                                       eModule : req.body.eModuleId,
                                       permision : element.permision,
                                       status : "unseen",
                                       date : new Date() 
                                   });
                                   prof.save(function(err){
                                       callback(null);
                                   });
                                 }
                               });
                           },
                           function(err){
                               callback(null,null);
                           }) 
               }
           ],
           function(err,data){
               if(err){ 
                    res.send(JSON.stringify(err,null,'\t'));
                    console.log(JSON.stringify(err,null,'\t'))
               }
               else{
                    res.send(JSON.stringify({code : "200",message:"",data : data},null,'\t'));
                    console.log(JSON.stringify({code : "200",message:"",data : data},null,'\t'))
               }
               console.log("connection to database closed"); 
               mongoose.connection.close();
           }
           )
           
       });
       
       
});


router.post('/remplireEmodule',function(req,res){
        res.setHeader('Content-Type', 'application/json');
       
       //connection a la base de donnée
       var db = mongoose.connection; 
       mongoose.connect('mongodb://localhost:27017/test');
       
       db.on('error',function(){
                 console.log(JSON.stringify({code : '001',message :"connection to database faild"},null));
                 res.send(JSON.stringify({code : '001',message :"connection to database faild"}));
                 mongoose.connection.close();
       });
       
       db.once('open',function(){
           console.log("connection to database ");
           console.log("response is : ");
           async.waterfall([
               function(callback){
                  databaseModels.eModules.findById(req.body.eModuleId,function(err,eModule){
                      if(err) return callback({code : '002',message:"database problem!"})
                      if(!eModule) return callback({code : '004',message : "eModule not found !!"});
                      callback(null,eModule);
                  });
               },
               function(eModule,callback){
                   eModule.intitulee  = req.body.intitulee;
                   eModule.prerequis = req.body.prerequis;
                   eModule.objectif = req.body.objectif;
                   eModule.volume_horaire = req.body.volumeHoraire;
                   eModule.activitees_pratique = req.body.activiteesPratique;
                   eModule.description_programme = req.body.descriptionProgramme;
                   eModule.modalitee_evaluation = req.body.modaliteeEvaluation;
                   eModule.note_minimal = req.body.noteMinimal;
                   eModule.lastUpdate = new Date();
                   eModule.updatedBy = req.body.userId;
                   
                   eModule.save(function(err){
                       if(err) return callback({code : '002',message:"database problem!"});
                       callback(null,eModule._id,eModule.createdBy,eModule.sendTo);
                   });
                   
               },
               function(eModuleId,eModuleCreatedBy,eModuleSendTo,callback){
                   //update notif of owner
                   //notif others
                   
                   callback(null,null);
               }
           ],
           function(err,data){
               if(err){ 
                    res.send(JSON.stringify(err,null,'\t'));
                    console.log(JSON.stringify(err,null,'\t'))
               }
               else{
                    res.send(JSON.stringify({code : "200",message:"",data : data},null,'\t'));
                    console.log(JSON.stringify({code : "200",message:"",data : data},null,'\t'))
               }
               console.log("connection to database closed"); 
               mongoose.connection.close(); 
           }
           )
       });
    
});


router.post("/updateEmodule",function(req,res){
       res.setHeader('Content-Type', 'application/json');
       //connection a la base de donnée
       var db = mongoose.connection; 
       mongoose.connect('mongodb://localhost:27017/test');
       
       db.on('error',function(){
                 console.log(JSON.stringify({code : '001',message :"connection to database faild"},null));
                 res.send(JSON.stringify({code : '001',message :"connection to database faild"}));
                 mongoose.connection.close();
       });
       
       db.once('open',function(){
           console.log("connection to database ");
           console.log("response is : ");
             
       });
       
});

//{eModuleId : _Id ,userId : _Id}
router.post("/deleteEmodule",function(req,res){
       res.setHeader('Content-Type', 'application/json');
       //connection a la base de donnée
       var db = mongoose.connection; 
       mongoose.connect('mongodb://localhost:27017/test');
       
       db.on('error',function(){
                 console.log(JSON.stringify({code : '001',message :"connection to database faild"},null));
                 res.send(JSON.stringify({code : '001',message :"connection to database faild"}));
                 mongoose.connection.close();   
       });
       
       db.once('open',function(){
           console.log("connection to database ");
           console.log("response is : ");
           async.series([
               function(callback){
                   databaseModels.eModules.findById(req.body.eModuleId,function(err,eModule){
                       if(err) return callback({code : '002',message :"database problem!"},null);
                       if(!eModule) return callback({code : '004',message :"eModule doesn't exist!!"})
                       async.each(
                           eModule.sendTo,
                           function(element,callback){
                               databaseModels.profs.findById(element.id,function(err,prof){
                               if(err) return callback(err);
                               if(!prof) return callback(err)
                                   prof.deleteEModule(req.body.eModuleId);
                                   prof.save(function(err){
                                       if(err) return callback(err)
                                       callback(null);
                                   });
                               });
                           },
                           function(err){
                               if(err) return callback(err,null);
                               callback(null,null);
                           })  
                   });
               },
               function(callback){
                  databaseModels.eModules.remove({_id : req.body.eModuleId},function(err){
                       if(err) return callback({code : '002',message :"database problem!!"},null);
                       callback(null,null);
                   });
               }
           ],
           function(err,data){
               if(err){ 
                    res.send(JSON.stringify(err,null,'\t'));
                    console.log(JSON.stringify(err,null,'\t'))
               }
               else{
                    res.send(JSON.stringify({code : "200",message:"eModule deleted",data : data},null,'\t'));
                    console.log(JSON.stringify({code : "200",message:"",data : data},null,'\t'))
               }
               console.log("connection to database closed"); 
               mongoose.connection.close();
           });
       })
      
});


//{userId : id,searchQuery : {key : value},responseFields : "filed1 filed2 .."}
router.post("/getEmodule",function(req,res){
       res.setHeader('Content-Type', 'application/json');
       //connection a la base de donnée
       var db = mongoose.connection; 
       mongoose.connect('mongodb://localhost:27017/test');
       
       db.on('error',function(){
                 console.log(JSON.stringify({code : '001',message :"connection to database faild"},null));
                 res.send(JSON.stringify({code : '001',message :"connection to database faild"}));
                 mongoose.connection.close();   
       });
       
       db.once('open',function(){
           console.log("connection to database ");
           console.log("response is : ");
           async.series([
               function(callback){
                   databaseModels.eModules.find(req.body.query,req.body.fields)
                   .populate('createdBy','prenom')
                   .populate('updatedBy','nom')
                   .exec(
                   function(err,eModules){
                       if(err) return callback({code : '002',message :"database problem!!"},null);
                       callback(null,eModules);
                   });
               }
           ],
           function(err,data){
               if(err){ 
                    res.send(JSON.stringify(err,null,'\t'));
                    console.log(JSON.stringify(err,null,'\t'))
               }
               else{
                    res.send(JSON.stringify({code : "200",message:"",data : data[0]},null,'\t'));
                    console.log(JSON.stringify({code : "200",message:"",data : data[0]},null,'\t'))
               }
               console.log("connection to database closed"); 
               mongoose.connection.close();
           });
       });
});

router.post("/count",function(req,res){
       res.setHeader('Content-Type', 'application/json');
       //connection a la base de donnée
       var db = mongoose.connection; 
       mongoose.connect('mongodb://localhost:27017/test');
       
       db.on('error',function(){
                 console.log(JSON.stringify({code : '001',message :"connection to database faild"},null));
                 res.send(JSON.stringify({code : '001',message :"connection to database faild"}));
                 mongoose.connection.close();   
       });
       
       db.once('open',function(){
           async.series
       })
});

module.exports = router;
