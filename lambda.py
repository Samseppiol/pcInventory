from src.create import add_record

def lambda_handler(event, context):

	if 'httpMethod' in event:
		method = event['httpMethod'].upper()
		if method == 'GET':
			print('METHOD IS GET')
			if event['pathParameters'] == None:
				print('Goto Scan')
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