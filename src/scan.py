import json
import os

import boto3
from botocore.exceptions import ClientError

if os.getenv("AWS_SAM_LOCAL", ""):
    print("Within sam local")
    dynamodb = boto3.resource('dynamodb', endpoint_url="http://dynamodb:8000")
    PRODUCTS_TABLE = "products"
else:
    dynamodb = boto3.resource('dynamodb')
    PRODUCTS_TABLE = os.environ['PRODUCTS_TABLE']

def return_all_records():
    print('COMMENCING SCAN OF %s TABLE' % PRODUCTS_TABLE)
    table = dynamodb.Table(PRODUCTS_TABLE)

    try:
        result = table.scan()
        if result['Items'] == []:
            response = {
                "statusCode": 404,
                "body": json.dumps({"Message": "No items found"})
            }
        else:
            print("Successful scan, returning items")
            response = {
                "statusCode": 200,
                "body": json.dumps(result['Items'])
            }
    except ClientError as e:
        print(e.response['Error']['Message'])
        response = {
            "statusCode": 500,
            "body": json.dumps({"Message": "Error scanning database"})
        }
    
    return response