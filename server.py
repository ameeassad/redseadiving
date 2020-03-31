from flask import Flask
from flask import render_template
from flask import Response, request, jsonify, url_for, redirect
import csv

app = Flask(__name__)

first_load = True
current_id = 0
data = []

def load_data():
    global first_load
    input_file = csv.DictReader(open("data/redseadiving.csv"))
    for row in input_file:
        entry = row
        entry['id']=int(entry['id'])
        entry['maxdepth']=int(entry['maxdepth'])

        sights_list = entry['sights'].lower().split(',')
        sights = []

        for s in sights_list:
            sights.append({'sighting': s, 'mark_as_deleted': False})

        entry['sights'] = sights

        data.append(entry)
    first_load=False

@app.route('/')
def index():
    global data
    global first_load

    if first_load==True:
        load_data()
    
    return render_template("home.html", data=data[-10:])

@app.route('/search_data', methods=['GET', 'POST'])
def search_data():
    global data 
 
    query = request.form['query'].lower()
    matches = []
    for entry in data:
        if query in entry['name'].lower():
            matches.append({'id': entry['id'], 'name': entry['name']})

    return render_template("search_results.html", matches=matches, query=query)

@app.route('/create')
def create():
    global data
    global first_load
    if first_load==True:
        load_data()
    id = len(data)
    return render_template("create.html", id=id)

@app.route('/save_entry', methods=['GET', 'POST'])
def save_entry():
    global data
    current_id = len(data)
    
    json_data = request.get_json() 
    name = json_data["name"]
    image = json_data["image"]
    description = json_data["description"]
    maxdepth = int(json_data["maxdepth"])
    sights_list = json_data["sights"].lower().split(",")

    sights = []
    for s in sights_list:
        sights.append({'sighting': s, 'mark_as_deleted': False})

    new_entry = {
        "id": current_id,
        "name": name,
        "description": description,
        "image": image,
        "maxdepth": maxdepth,
        "sights": sights
    }
    data.append(new_entry)

    return jsonify(id = current_id)

@app.route('/view/<id>/')
def view(id):
    global data
    global first_load
    if first_load==True:
        load_data()
    view = data[int(id)]

    sights = []
    for s in data[int(id)]['sights']:
        if s['mark_as_deleted'] == False:
            sights.append(s['sighting'])

    return render_template('view.html', id=id, name=view['name'], image=view['image'], description=view['description'], maxdepth=view['maxdepth'], sights=sights) 

@app.route('/save_sighting', methods=['GET', 'POST'])
def save_sighting():
    global data
    
    json_data = request.get_json() 
    id = int(json_data["id"])
    sighting = json_data["sighting"]

    data[id]['sights'].append({'sighting': sighting, 'mark_as_deleted':False})
    
    sights = []
    for s in data[id]['sights']:
        if s['mark_as_deleted'] == False:
            sights.append(s['sighting'])

    return jsonify(sights= sights)

@app.route('/delete_sighting', methods=['GET', 'POST'])
def delete_sighting():
    global data
    
    json_data = request.get_json() 
    id = int(json_data["id"])
    sighting = json_data["sighting"]

    for d in data[id]['sights']:
        if d['sighting']==sighting:
            d['mark_as_deleted'] = True
    
    sights = []
    for s in data[id]['sights']:
        if s['mark_as_deleted'] == False:
            sights.append(s['sighting'])

    return jsonify(sights= sights)

@app.route('/undo_delete_sighting', methods=['GET', 'POST'])
def undo_delete_sighting():
    global data
    
    json_data = request.get_json() 
    id = int(json_data["id"])
    sighting = json_data["sighting"]

    for d in data[id]['sights']:
        if d['sighting']==sighting:
            d['mark_as_deleted'] = False
    
    sights = []
    for s in data[id]['sights']:
        if s['mark_as_deleted'] == False:
            sights.append(s['sighting'])

    return jsonify(sights= sights)

@app.route('/save_description', methods=['GET', 'POST'])
def save_description():
    global data
    
    json_data = request.get_json() 
    id = int(json_data["id"])
    description = json_data["description"]

    data[id]['description'] = description

    return jsonify(description= description)

if __name__ == '__main__':
   app.run(debug = True)




