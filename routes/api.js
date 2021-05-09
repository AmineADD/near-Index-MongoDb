/* Packages */
var express = require('express');   
const {MongoClient} = require('mongodb'); 
const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false";
const client = new MongoClient(uri);
client.connect().then(()=>{
/*index for geographiq research */
client.db("restaurants").collection("restau").createIndex({
    "address.coords":"2dsphere"
});
});

/* APi functions*/
module.exports = (function() {
    var api = express.Router();
    api.route("/nbrestau").get(async(req, res) =>{ 
        var result = await client.db("restaurants").collection("restau").estimatedDocumentCount();
        res.send({nb:result});
    }); 

    api.route("/noms/:borough").get(async (req,rep)=>{
 
        await client.db("restaurants").collection("restau").find({"borough":{$regex :`.*${req.params.borough}.*`}}).sort({ name: 1 }).toArray((err, arr) => {
           if (err) { 
            rep.status(200).render("error", {title:"Erreur 404 !",description:err});
           } else {
            rep.status(200).render("recherche", {title:"Recherche par restaurant sans spécialité : ", nb:arr.length,params:`${req.params.borough}`,data:arr});
           }
         });  

   });
    api.route("/noms/:borough/:specialty").get(async (req,rep)=>{
 
         await client.db("restaurants").collection("restau").find({"borough":{$regex :`.*${req.params.borough}.*`},"cuisine":{$regex : `.*${req.params.specialty}.*`}}).sort({ name: 1 }).toArray((err, arr) => {
            if (err) { 
                rep.status(200).render("error", {title:"Erreur 404 !",description:err});
            } else { 
                rep.status(200).render("recherche", {title:"Recherche par restaurant et spécialité ", nb:arr.length,params:`${req.params.borough},${req.params.specialty}`,data:arr});
            }
          });  

    });

    api.route("/coords").get(async (req,rep)=>{  
            
        await client.db("restaurants").collection("restau").findOne({"address.coord":{ $near: { $geometry: { type: "Point" , "coordinates": [  parseFloat(req.query.x), parseFloat(req.query.y)  ] },
        $maxDistance: 5 }}},(err,arr)=>{
         
                if (err) { 
                    console.log(err)
                 rep.status(200).render("error", {title:"Erreur 404 !",description:err});
                } else {
                 rep.status(200).render("position", {title:"Recherche par position géographique ",data:arr,paramsx:req.query.x,paramsy:req.query.y});
                }
             
        });  

   });

    return api;
})();
