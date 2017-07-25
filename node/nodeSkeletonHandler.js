'use strict';
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

// Atlas connection outside of Lambda handler
const atlas_uri = ">>> Atlas conn string here <<<"; // to-do read from AWS keys

let cachedDb = null;

exports.handler = (event, context, callback) => {
    // Set to false to allow re-use of database connections across lambda calls
    // see http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        if (cachedDb && cachedDb.serverConfig.isConnected()) {
            //Execute Query
            executeQuery(cachedDb, {}, callback);
        }
        else {
            console.log("=== CONNECTING TO MONGODB ATLAS ==="); // Log to CloudWatch
            MongoClient.connect(atlas_uri, function (err, db) {
                if (err) {
                    console.log(`the error is ${err}.`, err);
                    process.exit(1);
                }
                cachedDb = db;
                //Execute Query
                executeQuery(cachedDb, {}, callback);
            });
        }
    }
    catch (err) {
        console.error('an error occurred', err);
        callback(err, null);
    }
}

function executeQuery(db, jsonCriteria, callback) {
  var collection = db.collection('MyColl');
  // Find some documents
  collection.find(jsonCriteria).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(null, docs);
  });
}
