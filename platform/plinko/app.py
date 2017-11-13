from flask import (
    Flask,
    jsonify,
    request,
)
import requests

from plinko.config import ASSET_URL
from plinko.client import get_or_create_wedding_for_user

app = Flask(__name__)

@app.route('/')
def web_app():
    response = requests.get(ASSET_URL)
    return response.text


@app.route('/assets/<path>')
def web_asset(path):
    response = requests.get('/'.join((ASSET_URL, 'assets', path)))
    return response.text


@app.route('/api/v0/my_wedding', methods=['GET'])
def get_wedding():
    # TODO: not this
    user_id = 'fake_user_id'

    wedding = get_or_create_wedding_for_user(user_id)
    print 'app'
    print wedding.to_model()
    return jsonify(wedding.to_model())



if __name__ == "__main__":
    app.run(debug=True)
