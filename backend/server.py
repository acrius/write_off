'''
Backend server on Sanic.
'''
from sys import path

from sanic import Sanic
from sanic.response import json, html
from sanic_cors import CORS

import settings

from views import get_subdivisions, get_storages_for_subdivision,\
                  get_remains_for_storage, get_acts_for_storage,\
                  get_table_of_acts, save_act, save_act_table,\
                  update_subdivisions, update_storages, update_remains,\
                  get_main_things, update_main_things, activate_act,\
                  upload_acts

path.append(settings.PROJECT_PATH)

app = Sanic() #pylint: disable-msg=C0103

app.static('/static', 'static')

CORS(app)

#Routing

@app.route('/', methods=['GET',])
def index(request): #pylint: disable=W0613
    '''
    Get main page.
    '''
    with open('static/index.html') as html_file:
        response = html(html_file.read())
    return response

@app.route('/api/v01/subdivisions', methods=['GET',])
def get_subdivisions_api(request): #pylint: disable=W0613
    '''
    Get subdivisions with rest-api.
    '''
    return json(get_subdivisions())

@app.route('/api/v01/storages', methods=['GET',])
def get_storages(request):
    '''
    Get storages of subdivision with rest-api.
    '''
    subdivision_id = request.args.get('subdivision')
    if subdivision_id is not None:
        return json(get_storages_for_subdivision(subdivision_id))

@app.route('/api/v01/acts', methods=['GET', 'POST'])
def get_or_post_acts(request):
    '''
    Get or post acts of storage with rest-api.
    '''
    if request.method == 'GET':
        storage_id = request.args.get('storage')
        if storage_id is not None:
            return json(get_acts_for_storage(storage_id))
    elif request.method == 'POST':
        return json(save_act(request.json))

@app.route('/api/v01/act_table', methods=['GET', 'POST'])
def get_or_post_acts_table(request):
    '''
    Get or post table of act with rest-api
    '''
    if request.method == 'GET':
        act_id = request.args.get('act')
        if act_id is not None:
            return json(get_table_of_acts(act_id))
    elif request.method == 'POST':
        act_id = request.args.get('act')
        if act_id is not None:
            return json(save_act_table(request.json, act_id))

@app.route('/api/v01/remains', methods=['GET'])
def get_remains(request):
    '''
    Get storage remains with rest-api.
    '''
    storage_id = request.args.get('storage')
    if storage_id is not None:
        return json(get_remains_for_storage(storage_id))

@app.route('/api/v01/get_updated_subdivisions', methods=['GET'])
def get_updated_subdivisions(request): #pylint: disable=W0613
    '''
    Get updated subdivisions with rest-api.
    '''
    update_subdivisions()
    return json(get_subdivisions())

@app.route('/api/v01/get_updated_storages', methods=['GET'])
def get_updated_storages(request):
    '''
    Get updated storages of subdivision with rest-api.
    '''
    subdivision_id = request.args.get('subdivision')
    if subdivision_id is not None:
        update_storages(subdivision_id)
        return json(get_storages_for_subdivision(subdivision_id))

@app.route('/api/v01/get_updated_remains', methods=['GET'])
def get_updated_remains(request):
    '''
    Get storage updated remains with rest-api.
    '''
    storage_id = request.args.get('storage')
    if storage_id is not None:
        update_remains(storage_id)
        return json(get_remains_for_storage(storage_id))

@app.route('/api/v01/main_things', methods=['GET',])
def get_main_things_api(request): #pylint: disable=W0613
    '''
    Get subdivisions with rest-api.
    '''
    return json(get_main_things())

@app.route('/api/v01/get_updated_main_things', methods=['GET'])
def get_updated_main_things(request): #pylint: disable-msg=W0613
    '''
    Get updated subdivisions with rest-api.
    '''
    update_main_things()
    return json(get_main_things())

@app.route('/api/v01/activate_act', methods=['POST'])
def activate_act_api(request):
    '''
    Activate or diactivate if act is actived.
    '''
    act_id = request.args.get('act')
    if act_id is not None:
        activate_act(act_id)
        return json(True)

@app.route('/api/v01/upload_acts', methods=['POST'])
def upload_acts_api(request):
    '''
    Upload acts.
    '''
    storage_id = request.args.get('storage')
    if storage_id is not None:
        upload_acts(request.json, storage_id)
        return json(True)

if __name__ == '__main__':
    app.run(host=settings.HOST['address'], port=settings.HOST['port'])