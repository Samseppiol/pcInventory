import json
import os

import boto3
from botocore.exceptions import ClientError
dynamodb = boto3.resource('dynamodb')

PRODUCTS_TABLE = os.environ['PRODUCTS_TABLE']

def return_all_records():
    print('COMMENCING SCAN OF %s TABLE' % PRODUCTS_TABLE)
    table = dynamodb.Table(PRODUCTS_TABLE)

    try:
        result = table.scan()
        if 'Items' in result:
            response = {
                "statusCode": 200,
                "body": json.dumps(result['Items'])
            }
            print("Successful scan")
        else:
            response = {
                "statusCode": 404,
                "body": json.dumps("No items found")
            }
            print("No items found during scan")
    except ClientError as e:
        print(e.response['Error']['Message'])
        response = {
            "statusCode": 500,
            "body": json.dumps("Error scanning database")
        }
    
    return response