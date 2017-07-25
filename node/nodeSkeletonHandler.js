// Module dependencies
const MongoClient = require('mongodb').MongoClient;

// Atlas connection outside of Lambda handler
//const atlasUri = 'YOUR_ATLAS_CONNECTION_STRING_HERE'; // to-do read from AWS keys
const atlasUri = 'mongodb://nick:ni05pa904427*@free-shard-00-00-zftrn.mongodb.net:27017,free-shard-00-01-zftrn.mongodb.net:27017,free-shard-00-02-zftrn.mongodb.net:27017/todos?ssl=true&replicaSet=FREE-shard-0&authSource=admin'; // to-do read from AWS keys

// Cache DB connection for future use
let cachedDb;

// AWS event handler
exports.handler = (evt, ctx, cb) => {

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

        if (!cachedDb) {

            console.log(`=== CONNECTING TO MONGODB ATLAS ===`);

            MongoClient.connect(atlasUri, (err, db) => {

                if (err) {
                    console.error(`An error occurred! ${err}`);
                    process.exit(1);
                }

                // Assign db connection to variable for further use
                cachedDb = db;

                // Execute query
                executeQuery(cachedDb, {}, cb);

            });

        } else {
            executeQuery(cachedDb, {}, cb);
        }

    } catch (err) {
        console.error(`An error occurred! ${err}`);
    }

}
