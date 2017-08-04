// Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://snarvaez:snarvaez**@bddla17customers-shard-00-00-twijg.mongodb.net:27017,bddla17customers-shard-00-01-twijg.mongodb.net:27017,bddla17customers-shard-00-02-twijg.mongodb.net:27017/SingleView?ssl=true&replicaSet=BDDLA17Customers-shard-0&authSource=admin');

module.exports = db;
