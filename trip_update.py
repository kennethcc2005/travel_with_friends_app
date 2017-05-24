import psycopg2
import ast
import numpy as np
import simplejson
import urllib
import json
# from helpers import *

with open('api_key_list.config') as key_file:
    api_key_list = json.load(key_file)
api_key = api_key_list["distance_api_key_list"]
conn_str = api_key_list["conn_str"]

def ajax_available_events(county, state):
    county=county.upper()
    state = state.title()
    conn = psycopg2.connect(conn_str)   
    cur = conn.cursor()   
    cur.execute("select index, name from poi_detail_table_v2 where county='%s' and state='%s'" %(county,state))  
    poi_lst = [item for item in cur.fetchall()]
    conn.close()
    return poi_lst

def add_event(trip_locations_id, event_day, new_event_id=None, event_name=None, full_day = True, unseen_event = False):
    conn = psycopg2.connect(conn_str)   
    cur = conn.cursor()   
    cur.execute("select * from day_trip_table where trip_locations_id='%s'" %(trip_locations_id))  
    (index, trip_locations_id, full_day, regular, county, state, detail, event_type, event_ids) = cur.fetchone()
    if unseen_event:
        index += 1
        trip_locations_id = '-'.join([str(eval(i)['id']) for i in eval(detail)])+'-'+event_name.replace(' ','-')+'-'+event_day
        cur.execute("select details from day_trip_locations where trip_locations_id='%s'" %(trip_locations_id))
        a = cur.fetchone()
        if bool(a):
            conn.close()
            return trip_locations_id, a[0]
        else:
            cur.execute("select max(index) from day_trip_locations")
            index = cur.fetchone()[0]+1
            detail = list(eval(detail))
            #need to make sure the type is correct for detail!
            new_event = "{'address': 'None', 'id': 'None', 'day': %s, 'name': u'%s'}"%(event_day, event_name)
            detail.append(new_event)
            #get the right format of detail: change from list to string and remove brackets and convert quote type
            new_detail = str(detail).replace('"','').replace('[','').replace(']','').replace("'",'"')
            cur.execute("INSERT INTO day_trip_locations VALUES (%i, '%s',%s,%s,'%s','%s','%s');" %(index, trip_locations_id, full_day, False, county, state, new_detail))
            conn.commit()
            conn.close()
            return trip_locations_id, detail
    else:
        event_ids = db_event_cloest_distance(trip_locations_id, new_event_id)
        event_ids, google_ids, name_list, driving_time_list, walking_time_list = db_google_driving_walking_time(event_ids,event_type = 'add')
        trip_locations_id = '-'.join(event_ids)+'-'+event_day
        cur.execute("select details from day_trip_locations where trip_locations_id='%s'" %(trip_locations_id)) 
        if not cur.fetchone():
            details = []
            db_address(event_ids)
            for item in event_ids:
                cur.execute("select index, name, address from poi_detail_table_v2 where index = '%s';" %(item))
                a = cur.fetchone()
                detail = {'id': a[0],'name': a[1],'address': a[2], 'day': event_day}
                details.append(detail)
            #need to make sure event detail can append to table!
            cur.execute("insert into day_trip_table (trip_locations_id,full_day, regular, county, state, details, event_type, event_ids) VALUES ( '%s', %s, %s, '%s', '%s', '%s', '%s', '%s')" %( trip_location_id, full_day, False, county, state, details, event_type, event_ids))
            conn.commit()
            conn.close()
            return trip_locations_id, details
        else:
            conn.close()
            #need to make sure type is correct.
            return trip_locations_id, a[0]

def remove_event(full_trip_id, trip_locations_id, remove_event_id, remove_event_name=None, event_day=None, full_day = True):
    conn = psycopg2.connect(conn_str)   
    cur = conn.cursor()   
    cur.execute("select * from day_trip_table where trip_locations_id='%s'" %(trip_locations_id)) 
    (index, trip_locations_id, full_day, regular, county, state, detail, event_type, event_ids) = cur.fetchone()
    print 'test1' 
    import re
    event_ids = re.sub("\s+", ",", event_ids.strip())
    print event_ids.strip('[').strip(']').strip(',')
    print 'event_ids:', event_ids, type(event_ids), event_ids.split(' ')
    new_event_ids = ast.literal_eval(event_ids)
    print 'test2'
    new_event_ids.remove(remove_event_id)
    print 'test3'

    new_trip_locations_id = '-'.join(str(event_id) for event_id in new_event_ids)
    print 'test4'

    cur.execute("select * from day_trip_table where trip_locations_id='%s'" %(new_trip_locations_id))  
    check_id = cur.fetchone()
    if check_id:
        return new_trip_locations_id, check_id[-3]
    detail = ast.literal_eval(detail[1:-1])
    for index, trip_detail in enumerate(detail):
        if ast.literal_eval(trip_detail)['id'] == remove_event_id:
            remove_index = index
            break
    new_detail = list(detail)
    new_detail.pop(remove_index)
    new_detail =  str(new_detail).replace("'","''")
    regular = False
    cur.execute("select max(index) from day_trip_table where trip_locations_id='%s'" %(trip_locations_id)) 
    new_index = cur.fetchone()[0]
    new_index+=1
    cur.execute("INSERT INTO day_trip_table VALUES (%i, '%s', %s, %s, '%s', '%s', '%s', '%s','%s');" \
                %(new_index, new_trip_locations_id, full_day, regular, county, state, new_detail, event_type, new_event_ids))  
    conn.commit()
    conn.close()
    return new_trip_locations_id

def new_full_trip_afer_remove_event(full_trip_id, old_trip_locations_id, new_trip_locations_id):
    return new_full_trip_id, new_full_trip_details

def event_type_time_spent(adjusted_normal_time_spent):
    if adjusted_normal_time_spent > 180:
        return 'big'
    elif adjusted_normal_time_spent >= 120:
        return 'med'
    else:
        return 'small'

def switch_event_list(full_trip_id, trip_locations_id, switch_event_id, switch_event_name=None, event_day=None, full_day = True):
#     new_trip_locations_id, new_detail = remove_event(trip_locations_id, switch_event_id)
    conn = psycopg2.connect(conn_str)   
    cur = conn.cursor()   
    cur.execute("select name, city, county, state, coord_lat, coord_long,ranking, adjusted_visit_length from poi_detail_table_v2 where index=%s" %(switch_event_id))
    name, city, county, state,coord_lat, coord_long,poi_rank, adjusted_normal_time_spent = cur.fetchone()
    event_type = event_type_time_spent(adjusted_normal_time_spent)
    avialable_lst = ajax_available_events(county, state)
    cur.execute("select trip_location_ids,details from full_trip_table where full_trip_id=%s" %(full_trip_id))
    full_trip_detail = cur.fetchone()
    full_trip_detail = ast.literal_eval(full_trip_detail)
    full_trip_ids = [ast.literal_eval(item)['id'] for item in full_trip_detail]
    switch_lst = []
    for item in avialable_lst:
        index = item[0]
        if index not in full_trip_ids:
            event_ids = [switch_event_id, index]
            event_ids, google_ids, name_list, driving_time_list, walking_time_list = db_google_driving_walking_time(event_ids, event_type='switch')
            if min(driving_time_list[0], walking_time_list[0]) <= 60:
                cur.execute("select ranking, review_score, adjusted_visit_length from poi_detail_table_v2 where index=%s" %(index))
                target_poi_rank, target_rating, target_adjusted_normal_time_spent = cur.fetchone()
                target_event_type = event_type_time_spent(target_adjusted_normal_time_spent)
                switch_lst.append([target_poi_rank, target_rating, target_event_type==event_type])
    #need to sort target_event_type, target_poi_rank and target_rating
    return {switch_event_id: switch_lst}

def switch_event(trip_locations_id, switch_event_id, final_event_id, event_day):
    new_trip_locations_id, new_detail = remove_event(trip_locations_id, switch_event_id)
    new_trip_locations_id, new_detail = add_event(new_trip_locations_id, event_day, final_event_id, full_day = True, unseen_event = False)
    return new_trip_locations_id, new_detail