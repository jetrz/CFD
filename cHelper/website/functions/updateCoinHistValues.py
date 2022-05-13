from .getPrices import getPrices
from ..models import histValues
from .. import db

import time 

def updateCoinHistValues():
    while True:
        coins = ["BTC","ETH","DOGE"]
        prices_dict = getPrices(coins)
        
        histEntry = histValues(BTC=prices_dict["BTC"],ETH=prices_dict["ETH"],DOGE=prices_dict["DOGE"])
        db.session.add(histEntry)
        db.session.commit()
        print(histEntry)
        
        time.sleep(60*5) #update every 5 mins