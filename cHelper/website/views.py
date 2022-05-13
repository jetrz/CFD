from flask import Blueprint, render_template, request
from flask_login import login_required, current_user
from .models import User, Wallet, histValues
from . import db

from .functions.addValue import addValue
from .functions.getPrices import getPrices
from .functions.getWalletValue import getWalletValue

import json, random, time
from datetime import datetime
from flask import Response, stream_with_context

views = Blueprint('views', __name__)

#home page
@views.route('/', methods=['POST', 'GET'])
@login_required #can only access this page if user is logged in
def home():
    current_wallet = Wallet.query.filter_by(uid=current_user.uid).first()
    
    if request.method == 'POST':
        coin = request.form.get('update_wallet_coin')
        val = request.form.get('update_wallet_value')
        addValue(current_user.uid, coin, val)

    #convert coins in user's wallet to dictionary form, i.e. {'BTC':1.0, 'ETH':0.5}
    wallet_dict = dict((col, getattr(current_wallet, col)) for col in current_wallet.__table__.columns.keys()) #dict of header : value e.g. {'BTC':0.0, 'uid':1}
    del wallet_dict['uid']
    
    #get prices of all coins
    coins = []
    prices_dict = {}
    for coin in wallet_dict.keys():
            coins.append(coin)
    prices_dict = getPrices(coins)
        
    #for testings
    hist_data = histValues.query.order_by(histValues.timestamp)
        
    return render_template("home.html", 
                           user=current_user, 
                           wallet=current_wallet, 
                           wallet_dict=wallet_dict, 
                           prices_dict=prices_dict,
                           hist_data=hist_data)

#for graph in home page    
@views.route('/home-chart-data')
def chart_data():
    current_wallet = Wallet.query.filter_by(uid=current_user.uid).first()
    #convert coins in user's wallet to dictionary form, i.e. {'BTC':1.0, 'ETH':0.5}
    wallet_dict = dict((col, getattr(current_wallet, col)) for col in current_wallet.__table__.columns.keys()) #dict of header : value e.g. {'BTC':0.0, 'uid':1}
    del wallet_dict['uid']
    
    def generate_wallet_value():
        while True:
            currentWalletVal = getWalletValue(wallet_dict)
                
            json_data = json.dumps(
                {'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'value': currentWalletVal})
            yield f"data:{json_data}\n\n"
            time.sleep(20)

    response = Response(stream_with_context(generate_wallet_value()), mimetype="text/event-stream")
    response.headers["Cache-Control"] = "no-cache"
    response.headers["X-Accel-Buffering"] = "no"
    return response