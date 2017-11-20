from flask import (
    Flask,
    jsonify,
    request,
)
import json
import requests

from plinko import client
from plinko.config import ASSET_URL
from plinko.genome.client import generate_random_genome

app = Flask(__name__)

# TODO: not this
def _get_user_id():
    return 'fake_user_id'



@app.route('/')
def web_app():
    response = requests.get(ASSET_URL)
    return response.text


@app.route('/assets/<path>')
def web_asset(path):
    response = requests.get('/'.join((ASSET_URL, 'assets', path)))
    return response.text


##########################
#          API           #
##########################

@app.route('/api/v0/my_wedding', methods=['GET'])
def get_wedding():
    user_id = _get_user_id()
    wedding = client.get_or_create_wedding_for_user(user_id)
    return jsonify(wedding.to_dict())


# Guests
@app.route('/api/v0/guest_list', methods=['GET'])
def get_guest_list():
    user_id = _get_user_id()
    raise NotImplemented


@app.route('/api/v0/guest_list/create_group', methods=['POST'])
def new_group():
    user_id = _get_user_id()
    data = json.loads(request.data)

    group = client.create_group(user_id, data.get('guests', []))
    return jsonify(group.to_dict())


@app.route('/api/v0/group/<group_id>', methods=['DELETE'])
def delete_group(group_id):
    user_id = _get_user_id()

    group = client.delete_group(group_id)
    return "", 200


@app.route('/api/v0/guest_group/<group_id>/create_guest', methods=['POST'])
def create_guest(group_id):
    user_id = _get_user_id()
    data = json.loads(request.data)

    guest = client.create_guest_for_group(group_id, data['name'])
    return jsonify(guest.to_dict())


@app.route('/api/v0/guest/<guest_id>', methods=['DELETE'])
def remove_guest(guest_id):
    # TODO: access restrictions
    user_id = _get_user_id()
    client.remove_guest(guest_id)
    return "", 200


@app.route('/api/v0/guest/<guest_id>/add_tag', methods=['POST'])
def add_tag(guest_id):
    user_id = _get_user_id()
    data = json.loads(request.data)

    guest = client.add_tag_for_guest(guest_id, data['text'])
    return jsonify(guest.to_dict())


@app.route('/api/v0/guest/<guest_id>/remove_tag/<tag_id>', methods=['POST'])
def remove_tag(guest_id, tag_id):
    user_id = _get_user_id()
    guest = client.remove_tag_from_guest(guest_id, tag_id)
    return jsonify(guest.to_dict())


@app.route('/api/v0/layout/create_table', methods=['POST'])
def new_table():
    user_id = _get_user_id()
    data = json.loads(request.data)

    table = client.create_table(
        user_id,
        x=data['x'],
        y=data['y'],
        width=data['width'],
        height=data['height'],
        table_type=data['table_type'],
        number_of_seats=data['number_of_seats'],
    )
    return jsonify(table.to_dict())


@app.route('/api/v0/table/<table_id>', methods=['DELETE'])
def delete_table(table_id):
    user_id = _get_user_id()

    table = client.delete_table(table_id)
    return "", 200


@app.route('/api/v0/create_lineage', methods=['GET'])
def create_lineage():
    user_id = _get_user_id()
    tags = client.get_tags_for_wedding(user_id)
    generation = create_seed_generation(tags)
    return jsonify([child.to_dict() for child in generation])


if __name__ == "__main__":
    app.run(debug=True)
