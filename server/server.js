var express = require("express");
var bodyParser = require("body-parser");
const PORT = 8082;
const cors = require("cors");
const axios = require("axios");
const Sequelize = require("sequelize");
var app = express();
var http = require("http");
var session = require("express-session");
//starage tabele
const tables = {};

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(cors());


//conectare la bd
const sequelize = new Sequelize('contacts', 'root', 'ase', {    //
  dialect: 'mysql',
  host: "localhost",
  port: 3306,
});

//tabela
tables.contacts = sequelize.define("contacts", {
    name: Sequelize.STRING,
    company: Sequelize.STRING,
    job_title : Sequelize.STRING,
    e_mail:Sequelize.STRING,
    phone_number:Sequelize.STRING,
    note:Sequelize.STRING,
    adress:Sequelize.STRING,
    birthday: Sequelize.DATE
});

//tabela
tables.contacts_ext = sequelize.define("contacts_extension", {
    event: Sequelize.STRING,
    site: Sequelize.STRING,
    relation : Sequelize.STRING,
    contactID : Sequelize.INTEGER
});
//{loggingIn: console.log}
sequelize.sync();


var GoogleContacts = require('google-contacts').GoogleContacts;
var conn = new GoogleContacts({
  token: 'AIzaSyDBk3fE06TlVQK88Mo2792CE37PKIAZvcE'
});

//metoda de citire din baza de date
const Retrieve = function(param, callback)
{
    var id;
    var table  = tables[param.table];
    if ( typeof param.data === "undefined" ) 
    {
        table.findAll().then(function(rr){
            callback(200,rr);
        });
    }
    else
    {
        id = JSON.parse(param.data);
        if (typeof param.column !== "undefined")
        {
            // table.findAll({ where { param.column : id } }).then(function(rr){
            //     callback(200,rr);
            // });
        }
        else
        {
            table.findById(id).then(function(rr){
                callback(200,rr);
            });       
        }
        
        
    }    
   
    
    
    
};

//metoda de scriere in baza de date
const Exec = function(param, callback)
{
    var table  = tables[param.table];
    switch(param.data.operation)
    {
        case "insert":
            table.create(param.date).then(function(rr)
            {
                callback(rr);
            });
            break;
            
        case "update":
            table.update(param.data.update, { where: param.data.where }).then(function(rr)
            {
                callback(rr);
            });
            break;
            
        case "delete":
            table.destroy(param.data).then(function(rr)
            {
                callback(rr);
            });
            break;
    }
};

//login pe ws
const login = 
{
  username : "bruleaoana",
  password: "ase",
  access : false   //
};

//interfata ws 
app.use('/api/get', function(req, res) {
    var data = JSON.parse(req.body.param);
   if (!login.access) res.status(404).send('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Error</title></head><body><pre>Page not found</pre></body></html>');
   if (typeof data.table == "undefined" )  res.status(200).send('{"Message", "Invalid operation"}');
   
    Retrieve({table: data.table, data: data.params }, function(status, ds){
        var a = JSON.stringify(ds);
        res.status(status).send(a);
    });
   
});
app.use('/api/login', function(req, res) {
    var param = JSON.parse(req.body.param);
    res.set('Content-Type', 'application/json');
    
    if (param.username == login.username && param.password == login.password ) 
    {
        login.access = true;
        res.status(200).send('{"Access": true}');   
    }else
    {
        res.status(200).send('{"Access": false}');   
    }
   
});
app.use('/api/logout', function(req, res) {
    login.access = false;
    res.status(200).send('ok');
   
});


app.post('/api/set', function(req, res) {
    var param = JSON.parse(req.body.param);
    if (!login.access) res.status(404).send('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Error</title></head><body><pre>Page not found</pre></body></html>');
    if (typeof param.table == "undefined" )  res.status(200).send('{"Message", "Invalid operation"}');
   
    Exec({table: param.table, data: param.params }, function(status, ds){
        res.status(status).send(ds);
    });
   
});
//end
var server = http.createServer(app);
server.listen(PORT);
server.on('listening', function() {
    console.log(`listening to ${PORT}`);
});
console.log("https://contacts-bruleaoana.c9users.io:"+PORT+"/");  //
