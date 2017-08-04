const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const atlasUri = process.env['MONGODB_ATLAS_CLUSTER_URI'];

const COLLNAME = 'Customers';

let cachedDb;

exports.GET_handler = (evt, ctx, cb) => {

  // Set to false to allow re-use of database connections across lambda calls
  // See http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
  ctx.callbackWaitsForEmptyEventLoop = false;

  var options = { limit: 50 }; // to-do paging

  var query = {};
  if ('id' in evt) {
    query._id = ObjectID.createFromHexString(evt.id);
  }

  executeQuery(cachedDb, COLLNAME, query, options, cb);
};

exports.GET_Renewals_handler = (evt, ctx, cb) => {

  // Set to false to allow re-use of database connections across lambda calls
  // See http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
  ctx.callbackWaitsForEmptyEventLoop = false;

  var options = { limit: 50 }; // to-do paging

  var query = {};

  if ('policyType' in evt) {
    query['policies.policyType'] = evt.policyType;
  }

  if ('expiresInDays' in evt) {

    var startDt = new Date();
    var endDt = new Date(startDt.getTime() + (evt.expiresInDays * 24 * 60 * 60 * 1000));

    query['policies.nextRenewalDt'] = { '$gte': startDt, '$lte': endDt };
  }

  if (('locLat' in evt) && ('locLon' in evt) && ('mileRadius' in evt)) {

    var lon = evt.locLon;
    var lat = evt.locLat;
    var radius = evt.mileRadius / 3959; // to radians

    var geoQuery = { "$geoWithin" : { "$centerSphere" : [[lat,lon],radius] }};

    if ('policyType' in evt) {
      switch (evt.policyType) {

        case 'home':
          query['policies.address.location'] = geoQuery;
          break;

        case 'auto':
          query['address.location'] = geoQuery;
          break;
      }
    }
  }

  executeQuery(cachedDb, COLLNAME, query, options, cb);
};

function executeQuery(db, collName, query, options, cb) {

  function execute(db, collName, query, options, cb) {

    console.log('QUERY on ' + collName + ': ' + JSON.stringify(query));

    db.collection(collName).find(query, options).toArray(function(err, docs) {
        if (err) process.exit(1);

        console.log('FOUND ' + docs.length + ' documents.');

        cb(null, docs);
    });
  }

  try {
      if (!cachedDb || !cachedDb.serverConfig.isConnected()) {

          console.log('=== CONNECTING TO MONGODB ATLAS ===');

          MongoClient.connect(atlasUri, (err, db) => {
              if (err) {
                  console.error(`An error occurred! ${err}`);
                  process.exit(1);
              }
              cachedDb = db;
              execute(cachedDb, collName, query, options, cb);
          });
      } else {
          execute(cachedDb, collName, query, options, cb);
      }
  } catch (err) {
      console.error(`An error occurred! ${err}`);
  }
}
