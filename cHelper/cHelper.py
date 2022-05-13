#not used. for testing of json string response from coinbaseapi
from requests import Request, Session
import json
import pprint

url = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest'

parameters = {
    'slug': 'dogecoin,bitcoin',
    'convert':'SGD',
}

headers = {
    'Accepts':'application/json',
    'X-CMC_PRO_API_KEY':'c935f01e-f5d9-420e-8ac5-7957d831eb3e'
}

session = Session()
session.headers.update(headers)

response = session.get(url, params=parameters)['data']
pprint.pprint(json.loads(response.text))