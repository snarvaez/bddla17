'use strict';
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

// Atlas connection outside of Lambda handler
const atlas_uri = process.env['MONGODB_ATLAS_CLUSTER_URI'];

let cachedDb = null;

/*
event json - see https://mongodb.github.io/node-mongodb-native/markdown-docs/queries.html
{
	"collection": "COLLECTION_NAME",
	"query": {},
	"options": {
		"limit": n
	}
}
*/

exports.handler = (event, context, callback) => {
    // Set to false to allow re-use of database connections across lambda calls
    // see http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        if (cachedDb && cachedDb.serverConfig.isConnected()) {
            //Execute Query
            executeQuery(cachedDb, event.collection, event.query, event.options, callback);
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
                executeQuery(cachedDb, event.collection, event.query, event.options, callback);
            });
        }
    }
    catch (err) {
        console.error('an error occurred', err);
        callback(err, null);
    }
}

function executeQuery(db, collection, query, options, callback) {
  var collection = db.collection(collection);
  // Find some documents
  collection.find(query, options).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found " + docs.length + " docs");
    callback(null, docs);
  });
}
