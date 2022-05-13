from website import create_app
        
import threading
from website.functions.updateCoinHistValues import updateCoinHistValues

app = create_app()

if __name__ == '__main__':  
    x = threading.Thread(target=updateCoinHistValues)
    x.start()  
    app.run(debug=True, threaded=True)