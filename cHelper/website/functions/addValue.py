from ..models import Wallet
from .. import db

def addValue(uid, coin, val):
    current_wallet = Wallet.query.filter_by(uid=uid).first()
    
    #this is the best way i can find right now, could rly use improvement
    match coin:
        case "BTC":
            current_wallet.BTC += float(val)
        case "ETH":
            current_wallet.ETH += float(val)
        case "DOGE":
            current_wallet.DOGE += float(val)
    
    db.session.commit()