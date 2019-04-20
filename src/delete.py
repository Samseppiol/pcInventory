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

def delete_record(path_parameters):
    print('METHOD IS DELETE')

    if 'name' in path_parameters:

        table = dynamodb.Table(PRODUCTS_TABLE)
        try:
            result = table.delete_item(
                Key={
                    'Name': path_parameters['name']
                }
            )
            if 'ConsumedCapacity' in result:
                response = {
                    "statusCode": 404,
                    "body": json.dumps({"Message": "Record %s does not exist" % path_parameters['name']})
                }
            else:
                response = {
                    "statusCode": 200
                }
        except ClientError as e:
            print(e.response['Error']['Message'])
            response = {
                "statusCode": 500,
                "body": json.dumps({"Message": "Error deleting from database"})
            }
    else:
        raise Exception("Name parameter not found in path")

    return response