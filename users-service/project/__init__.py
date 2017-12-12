# users-service/project/__init__.py


import os

from flask import Flask, jsonify


# instantiate the app
app = Flask(__name__)

# set config
app.config.from_object(os.environ['APP_SETTINGS'])


@app.route('/users/ping', methods=['GET'])
def ping_pong():
    return jsonify({
        'status': 'success',
        'message': 'pong!'
    })