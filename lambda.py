from src.create import add_record
from src.scan import return_all_records

def lambda_handler(event, context):

	if 'httpMethod' in event:
		method = event['httpMethod'].upper()
		if method == 'GET':
			print('METHOD IS GET')
			if event['pathParameters'] == None:
				response = return_all_records()
			else:
				print('Goto get by id')
		elif method == 'POST':
			response = add_record(event['body'])
		elif method == 'PUT':
			print('Method is put')
		elif method == 'PATCH':
			print('Method is patch')
		elif method =='DELETE':
			print('Method is delete')
		else:
			raise Exception("Non compatible http method")
	else:
		raise Exception("No http method found")
	
	return response