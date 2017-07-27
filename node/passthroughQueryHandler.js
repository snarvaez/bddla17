// Module dependencies
const MongoClient = require('mongodb').MongoClient;

// Atlas connection outside of Lambda handler
<<<<<<< HEAD:node/passthroughQueryHandler.js
const atlas_uri = process.env['MONGODB_ATLAS_CLUSTER_URI'];
=======
const atlasUri = 'YOUR_ATLAS_CONNECTION_STRING_HERE'; // Set as ENV (e.g. process.env.ATLAS_CONNECTION_STRING)
>>>>>>> master:node/nodeSkeletonHandler.js

// Cache DB connection for future use
let cachedDb;

// AWS event handler
exports.handler = (evt, ctx, cb) => {

<<<<<<< HEAD:node/passthroughQueryHandler.js
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
=======
>>>>>>> master:node/nodeSkeletonHandler.js
    // Set to false to allow re-use of database connections across lambda calls
    // See http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
    ctx.callbackWaitsForEmptyEventLoop = false;

    // Executes query
    function executeQuery(db, query, cb) {

        // Find documents in tasks collection
        db.collection('tasks').find(query).toArray(function(err, docs) {
            if (err) process.exit(1);
            cb(null, docs);
        });

    }

    try {
<<<<<<< HEAD:node/passthroughQueryHandler.js
        if (cachedDb && cachedDb.serverConfig.isConnected()) {
            //Execute Query
            executeQuery(cachedDb, event.collection, event.query, event.options, callback);
        }
        else {
            console.log("=== CONNECTING TO MONGODB ATLAS ==="); // Log to CloudWatch
            MongoClient.connect(atlas_uri, function (err, db) {
=======

        if (!cachedDb || !cachedDb.serverConfig.isConnected()) {

            console.log(`=== CONNECTING TO MONGODB ATLAS ===`);

            MongoClient.connect(atlasUri, (err, db) => {

>>>>>>> master:node/nodeSkeletonHandler.js
                if (err) {
                    console.error(`An error occurred! ${err}`);
                    process.exit(1);
                }

                // Assign db connection to variable for further use
                cachedDb = db;
<<<<<<< HEAD:node/passthroughQueryHandler.js
                //Execute Query
                executeQuery(cachedDb, event.collection, event.query, event.options, callback);
=======

                // Execute query
                executeQuery(cachedDb, {}, cb);

>>>>>>> master:node/nodeSkeletonHandler.js
            });

        } else {
            executeQuery(cachedDb, {}, cb);
        }

    } catch (err) {
        console.error(`An error occurred! ${err}`);
    }

<<<<<<< HEAD:node/passthroughQueryHandler.js
function executeQuery(db, collection, query, options, callback) {
  var collection = db.collection(collection);
  // Find some documents
  collection.find(query, options).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found " + docs.length + " docs");
    callback(null, docs);
  });
=======
>>>>>>> master:node/nodeSkeletonHandler.js
}
