'''
Backend server on Sanic.
'''
from sys import path
from datetime import datetime

from sanic import Sanic
from sanic.response import json, html
from sanic_cors import CORS

import settings

from views import get_subdivisions, get_storages_for_subdivision, \
	get_remains_for_storage, get_acts_for_storage, \
	get_table_of_acts, save_act, save_act_table, \
	update_subdivisions, update_storages, update_remains, \
	get_main_things, update_main_things, activate_act, \
	upload_acts, genereate_acts_views, get_storekeepers, \
	append_storekeeper, delete_storekeeper, update_downloads_view

from tasks import change_storekeeper

from migrate import migrate

path.append(settings.PROJECT_PATH)

app = Sanic()  # pylint: disable-msg=C0103

app.static('/static', 'static')

CORS(app)


# Routing

@app.route('/', methods=['GET', ])
def index(request):  # pylint: disable=W0613
	'''
	Get main page.
	'''
	with open('static/index.html') as html_file:
		response = html(html_file.read())
	return response


@app.route('/api/v01/subdivisions', methods=['GET', ])
def get_subdivisions_api(request):  # pylint: disable=W0613
	'''
	Get subdivisions with rest-api.
	'''
	return json(get_subdivisions())


@app.route('/api/v01/storages', methods=['GET', ])
def get_storages(request):  # pylint: disable=W0613
	'''
	Get storages of subdivision with rest-api.
	'''
	return json(get_storages_for_subdivision())


@app.route('/api/v01/acts', methods=['GET', 'POST'])
def get_or_post_acts(request):
	'''
	Get or post acts of storage with rest-api.
	'''
	if request.method == 'GET':
		count = request.args.get('count')
		act_type = request.args.get('act_type')
		upload_start = request.args.get('upload_start')
		if upload_start:
			upload_start = datetime.strptime(upload_start, '%d.%m.%y').date()
		upload_end = request.args.get('upload_end')
		if upload_end:
			upload_end = datetime.strptime(upload_end, '%d.%m.%y').date()
		return json(get_acts_for_storage(count, act_type, upload_start, upload_end))
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
def get_updated_subdivisions(request):  # pylint: disable=W0613
	'''
	Get updated subdivisions with rest-api.
	'''
	update_subdivisions()
	return json(get_subdivisions())


@app.route('/api/v01/get_updated_storages', methods=['GET'])
def get_updated_storages(request):  # pylint: disable=W0613
	'''
	Get updated storages of subdivision with rest-api.
	'''
	update_storages()
	return json(get_storages_for_subdivision())


@app.route('/api/v01/get_updated_remains', methods=['GET'])
def get_updated_remains(request):
	'''
	Get storage updated remains with rest-api.
	'''
	storage_id = request.args.get('storage')
	if storage_id is not None:
		update_remains(storage_id)
		return json(get_remains_for_storage(storage_id))


@app.route('/api/v01/main_things', methods=['GET', ])
def get_main_things_api(request):  # pylint: disable=W0613
	'''
	Get subdivisions with rest-api.
	'''
	return json(get_main_things())


@app.route('/api/v01/get_updated_main_things', methods=['GET'])
def get_updated_main_things(request):  # pylint: disable-msg=W0613
	'''
	Get updated subdivisions with rest-api.
	'''
	update_main_things()
	return json(get_main_things())


@app.route('api/v01/genereate_acts', methods=['GET'])
def genereate_acts(request):
	subdivision_id = request.args.get('subdivision')
	if subdivision_id is not None:
		genereate_acts_views(subdivision_id)
		return json(get_acts_for_storage())


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


@app.route('/api/v01/storekeepers', methods=['GET', 'POST', 'DELETE'])
def get_or_post_storekeepers_api(request):
	if request.method == 'GET':
		return json(get_storekeepers())
	elif request.method == 'POST':
		return json(append_storekeeper(request.json))
	elif request.method == 'DELETE':
		storekeeper_name = request.args.get('storekeeper_name')
		if storekeeper_name is not None:
			return json(delete_storekeeper(storekeeper_name))


if __name__ == '__main__':
	# change_storekeeper()
	migrate()
	update_downloads_view()
	print('Start server')
	app.run(host=settings.HOST['address'], port=settings.HOST['port'])
