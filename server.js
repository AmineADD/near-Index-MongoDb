/* server packages */
const express = require('express')
const path = require('path')
var routes= require('./routes/api');
/* sever vars */ 
const server = express();
/* server config */
server.use(express.json());
server.use(express.urlencoded({
  extended: false 
}));
/* Server Views */ 
server.set("views", path.join(__dirname, "views"));
server.set("view engine", "pug");
server.use(express.static(path.join(__dirname, "public")));
/* Server APIS */ 
server.use(routes);
/* Server Errors Middleware */

server.use((req,res,next)=>{
    res.status(404);
    next(new Error("Error"));
});

server.use((err,req,res,next)=>{
     res.status(err.status|| 404);
     res.render("erreur",{title:"Erreur 404 !",description:"Server Express middleware a interprété la requête & create index"})
})

/* server start */ 
const port = 5000
server.listen(port,()=>{
    console.log("Server starting ",port)
});