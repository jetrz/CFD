#database models
from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func


#schema for user to be stored in database
class User(db.Model, UserMixin):
    uid = db.Column(db.Integer, primary_key=True) #auto increment
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    first_name = db.Column(db.String(255))
    
    def get_id(self):
        return self.uid
    
#schema for wallet, each wallet associated with one user
class Wallet(db.Model):
    #when adding a column here, remember to add it in functions/addValue.py, getPrices.py, main.py and histValues schema (below) as well
    BTC = db.Column(db.Float, default=0)
    ETH = db.Column(db.Float, default=0)
    DOGE = db.Column(db.Float, default=0)
    uid = db.Column(db.Integer, db.ForeignKey('user.uid'), primary_key=True)
    
#schema for historical values of all coins
class histValues(db.Model):
    BTC = db.Column(db.Float, default=0)
    ETH = db.Column(db.Float, default=0)
    DOGE = db.Column(db.Float, default=0)
    timestamp = db.Column(db.DateTime(timezone=True), default=func.now(), primary_key=True)
        
#schema for Note (not used)
#class Note(db.Model):
    #id = db.Column(db.Integer, primary_key=True)
    #data = db.Column(db.String(10000))
    #date = db.Column(db.DateTime(timezone=True), default=func.now())
    #user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    