import json
import os
import datetime
import uuid

import boto3
from botocore.exceptions import ClientError
dynamodb = boto3.resource('dynamodb')

PRODUCTS_TABLE = os.environ['PRODUCTS_TABLE']

def add_record(body):
    print('METHOD IS POST')
    body = json.loads(body)
    table = dynamodb.Table(PRODUCTS_TABLE)
    dateTimeObj = datetime.datetime.utcnow()
    timestampStr = dateTimeObj.strftime("%d-%b-%Y (%H:%M:%S.%f)")

    item = {
        'id': str(uuid.uuid1()),
        'Name': body['name'],
        'Price': body['price'],
        'Supplier': body['supplier'],
        'Modules': body['modules'],
        'Type': body['type'],
        'Created': timestampStr,
        'Updated': timestampStr
    }
    try:
        table.put_item(Item=item)
        response = {
            "statusCode": 200,
            "body": json.dumps(item)
        }
    except ClientError as e:
        print(e.response['Error']['Message'])
        response = {
            "statusCode": 500,
            "body": json.dumps({"Message": "Error adding to database"})
        }
    
    return response