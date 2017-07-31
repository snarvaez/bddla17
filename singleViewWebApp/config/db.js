// Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://localhost:27017');

module.exports = db;
