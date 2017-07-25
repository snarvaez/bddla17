from __future__ import print_function

import json
import pymongo

# Atlas connection outside of Lambda handler(s)
print('=== CONNECTING TO MONGODB ATLAS ===') # logs to CloudWatch
atlas_uri = ">>> Atlas uri conn string here <<<"
#to-do read from AWS keys

MongoClient = pymongo.MongoClient(atlas_uri, readPreference='secondaryPreferred')
print("=== DONE - DB NAME: " + MongoClient.get_default_database().name + " ===")


def lambda_handler(event, context):

    # get handle to collection
    coll = MongoClient.MyDB.MyColl
    ...
