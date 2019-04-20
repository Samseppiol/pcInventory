import json
import os

import boto3
from botocore.exceptions import ClientError

if os.getenv("AWS_SAM_LOCAL", ""):
    dynamodb = boto3.resource('dynamodb', endpoint_url="http://dynamodb:8000")
    PRODUCTS_TABLE = "products"
else:
    dynamodb = boto3.resource('dynamodb')
    PRODUCTS_TABLE = os.environ['PRODUCTS_TABLE']

def get_record_by_name(path_parameters):
    print('METHOD IS GET')

    if 'name' in path_parameters:

        table = dynamodb.Table(PRODUCTS_TABLE)
        try:
            result = table.get_item(
                Key={
                    'Name': path_parameters['name']
                }
            )
            print (result)
            if 'Item' in result:
                print("Successful read, returning item")
                response = {
                    "statusCode": 200,
                    "body": json.dumps(result['Item'])
                }
            else:
                response = {
                    "statusCode": 404,
                    "body": json.dumps({"Message": "No item found"})
                }
        except ClientError as e:
            print(e.response['Error']['Message'])
            response = {
                "statusCode": 500,
                "body": json.dumps({"Message": "Error reading from database"})
            }
    else:
        raise Exception("Name parameter not found in path")

    return response