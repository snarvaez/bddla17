var ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();

 // GET customerList.
router.get('/customerList', function(req, res) {
    var db = req.db;
    var collection = db.get('Customers');

    collection.find(
        { },
        {"limit": 100},
        function(e,docs){
          res.json(docs);
        }
    );
});

// GET customerDetails.
router.get('/customerDetails', function(req, res) {
    var db = req.db;
    var collection = db.get('Customers');

    collection.find(
        { _id : ObjectID.createFromHexString(req.query.id) },
        function(e,docs){
          res.json(docs);
        }
    );
});

module.exports = router;
