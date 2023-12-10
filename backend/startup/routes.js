var express=require('express');
var budget = require('../routes/budget');
var user = require('../routes/user');
var spending = require('../routes/spending');
var budgetType = require('../routes/budgetType');

module.exports=function(app){
    app.use(express.static('uploads'));
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use("/api/budget", budget);
    app.use("/api/budgetType", budgetType);
    app.use("/api/user", user);
    app.use("/api/spending", spending);
}