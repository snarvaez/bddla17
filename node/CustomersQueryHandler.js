const MongoClient = require('mongodb').MongoClient;
const atlasUri = process.env['MONGODB_ATLAS_CLUSTER_URI'];
const COLLNAME = "Customers";

let cachedDb;

exports.GET_handler = (evt, ctx, cb) => {

    // Set to false to allow re-use of database connections across lambda calls
    // See http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
    ctx.callbackWaitsForEmptyEventLoop = false;

    var query = {}
    if ("id" in evt)
      query.id = ObjectID.createFromHexString(event.id);

    var options = {
      limit: 50
    }

    try {

        if (!cachedDb || !cachedDb.serverConfig.isConnected()) {

            console.log(`=== CONNECTING TO MONGODB ATLAS ===`);

            MongoClient.connect(atlasUri, (err, db) => {

                if (err) {
                    console.error(`An error occurred! ${err}`);
                    process.exit(1);
                }

                cachedDb = db;

                executeQuery(cachedDb, COLLNAME, query, options, cb);

            });

        } else {
            executeQuery(cachedDb, COLLNAME, query, options, cb);
        }

    } catch (err) {
        console.error(`An error occurred! ${err}`);
    }

}

function executeQuery(db, collName, query, options, cb) {
    db.collection(collName).find(query, options).toArray(function(err, docs) {
        if (err) process.exit(1);
        cb(null, docs);
    });
}
