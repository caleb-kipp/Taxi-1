# server.py
# Lightweight Flask admin endpoint & example ML hook
from flask import Flask, request, jsonify
import math, time

app = Flask(__name__)

@app.route('/admin/health')
def health():
    return jsonify({'ok':True,'ts':int(time.time())})

@app.route('/ml/compatibility', methods=['POST'])
def compatibility():
    # expects JSON with driver and rider features; returns score 0-100
    j = request.json or {}
    driver = j.get('driver',{})
    rider = j.get('rider',{})
    score = 0
    score += (driver.get('rating',4.0)/5.0)*40
    score += min(20, driver.get('completedRides',0)/10)
    score += 20 if driver.get('verified') else 0
    score -= rider.get('cancellations',0)*2
    return jsonify({'score': int(max(0,min(100,score)))})

if __name__=='__main__':
    app.run(host='0.0.0.0',port=5001,debug=True)