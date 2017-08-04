from __future__ import print_function

import datetime
import json
import os
import pymongo
from bson.codec_options import CodecOptions

atlasUri = os.environ['MONGODB_ATLAS_CLUSTER_URI']

# =====================================
# Connection to Atlas outside of Lambda handler(s)
# =====================================
print('Loading function')
print('=== CONNECTING TO MONGODB ATLAS ===')

MONGOCLIENT = pymongo.MongoClient(atlasUri, readPreference='secondaryPreferred')
print("=== DONE - DB NAME: " + MONGOCLIENT.get_default_database().name + " ===")

# ==========================================================
def PATCH_UpdateContactInfo_lambda_handler(event, context):
# ==========================================================
    # assures filter element position against index element position
    from collections import OrderedDict
    filter = OrderedDict()

    if 'id' not in event:
        raise ValueError('Missing argument: id')

    from bson import ObjectId
    filter['_id'] = ObjectId(event['id'])

    update = {
        "$set" : {
            "cell" : event['cell'],
            "email" : event['email']
        }
    }

    try:
        from pymongo.collection import ReturnDocument

        # Collection handle with majority write
        result = MONGOCLIENT.SingleView.Customers \
                .with_options(write_concern=pymongo.write_concern.WriteConcern(w=2)) \
                .find_one_and_update( filter, update, return_document=ReturnDocument.AFTER )

        from bson.json_util import dumps
        return dumps(result)

    except Exception as err:
        print(err)
        raise
