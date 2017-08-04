// Database
const atlasUri = process.env['MONGODB_ATLAS_CLUSTER_URI'];
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(atlasUri);

module.exports = db;
