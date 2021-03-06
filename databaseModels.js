var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var eModuleSchema = mongoose.Schema(
                  {
                    intitulee : String,
                    prerequis : String,
                    objectif : String,
                    volume_horaire : 
                        {
                            cour : { type: Number, min: 0},
                            td : { type: Number, min: 0},
                            tp : { type: Number, min: 0}
                        },
                    activitees_pratique : [
                        {
                            libellee : String,
                            objectif : String,
                            travaux_terrain : { type: Number, min: 0},
                            projet : { type: Number, min: 0},
                            stage : { type: Number, min: 0},
                            visite_etude : { type: Number, min: 0} 
                        }
                        ],
                    description_programme : String, 
                    modalitee_evaluation : String,
                    note_minimal : { type: Number, min: 0 , max : 10},
                    
                    createdBy : {
                            type: mongoose.Schema.Types.ObjectId,
                            ref : 'prof'
                           },
                    sendTo : [{
                            id : {
                            type: mongoose.Schema.Types.ObjectId,
                            ref : 'prof'
                            },
                            permision : String
                           }],
                   creationDate : { type: Date, default: Date.now },
                   lastUpdate : { type: Date, default: Date.now },
                   updatedBy : {
                            type: mongoose.Schema.Types.ObjectId,
                            ref : 'prof'
                           },
                  }
              );
              
eModuleSchema.methods.appendSendTo = function(users){
    this.sendTo = this.sendTo.concat(users);
}
              
              
var moduleSchema = mongoose.Schema(
                 {
                     universite : String,
                     etablissement : String,
                     departement : String,
                     intitulee : String,
                     coordonnateur : 
                        {
                            type: mongoose.Schema.Types.ObjectId,
                            ref : 'prof'
                        },
                    didactique : String,
                    note_minimal : { type: Number, min: 0 , max : 10},
                    eModules : [
                           {
                            type: mongoose.Schema.Types.ObjectId,
                            ref : 'eModules'
                           }
                       ],
                    createdBy : {
                            type: mongoose.Schema.Types.ObjectId,
                            ref : 'prof'
                           },
                    sendTo : [{
                            type: mongoose.Schema.Types.ObjectId,
                            ref : 'prof'
                           }],
                   creationDate : { type: Date, default: Date.now },
                   lastUpdate : { type: Date, default: Date.now },
                   updatedBy : {
                            type: mongoose.Schema.Types.ObjectId,
                            ref : 'prof'
                           },                       
                 }
    );
 
 var profSchema = mongoose.Schema(
     {
         nom : String,
         prenom : String,
         tel : String,
         grade : String,
         email : String,
         password : String,
         notification : {
            eModuleNotif : [
                {
                    eModule : {
                        type : mongoose.Schema.Types.ObjectId,
                        ref : 'eModules'
                    },
                    permision : String,
                    status : String,
                    date : { type: Date, default: Date.now },
                }
            ]
        }
     }
 );

 
profSchema.methods.generatHash = function(password) {
            return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
         };
profSchema.methods.validPassword = function(password) {
            return bcrypt.compareSync(password, this.password);
        };
 

profSchema.methods.deleteEModule = function(eModuleId){
        this.notification.eModuleNotif.forEach(function(notif,index) {
            if(notif.eModule == eModuleId){
                this.notification.eModuleNotif.splice(index,1);
            }
        }, this);
}

profSchema.methods.addNotif = function(notif){
    this.notification.eModuleNotif.push(notif);
}

 var matierSchema = mongoose.Schema(
     {
         intitulee : String,
         niveau : String,
         filiere : String,
         semestre : String,
         prof : {
             type : mongoose.Schema.Types.ObjectId,
             ref : 'prof'
         },
         notes : [
             {
                 nomEtudiant : String,
                 note : {type : Number ,min:0 ,max:20}
             }
         ],
     }
 )
 
 
 
 
 module.exports = {
     eModules : mongoose.model('eModules',eModuleSchema),
     modules : mongoose.model('modules',moduleSchema),
     profs : mongoose.model('prof',profSchema),
     matiers : mongoose.model('matier',matierSchema),
 }
              