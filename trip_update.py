import psycopg2
import ast
import numpy as np
import simplejson
import urllib
import json
import re

from helpers import *

with open('api_key_list.config') as key_file:
    api_key_list = json.load(key_file)
api_key = api_key_list["distance_api_key_list"]
conn_str = api_key_list["conn_str"]

def convert_event_ids_to_lst(event_ids):
    try:
        if type(ast.literal_eval(event_ids)) == list:
            new_event_ids = map(int,ast.literal_eval(event_ids))
        else: 
            event_ids = re.sub("\s+", ",", event_ids.strip())
            event_ids = event_ids.replace('.','')
            new_event_ids = map(int,event_ids.strip('[').strip(']').strip(',').split(','))
    except:
        event_ids = re.sub("\s+", ",", event_ids.strip())
        event_ids = event_ids.replace('.','')
        new_event_ids = map(int,event_ids.strip('[').strip(']').strip(',').split(','))
    return new_event_ids

def add_search_event(poi_name, trip_location_id):
    conn = psycopg2.connect(conn_str)   
    cur = conn.cursor()   
    cur.execute("SELECT county, state, event_ids FROM day_trip_table WHERE trip_locations_id  = '%s' LIMIT 1;" %(trip_location_id))  
    # cur.execute("select index, name from poi_detail_table_v2 where county='%s' and state='%s'" %(county,state))  
    county, state, event_ids = cur.fetchone()
    event_ids = convert_event_ids_to_lst(event_ids)
    new_event_ids = str(tuple(event_ids))
    cur.execute("SELECT index, name FROM poi_detail_table_v2 WHERE index NOT IN {0} AND county='{1}' AND state='{2}' and name % '{3}' ORDER BY similarity(name, '{3}') DESC LIMIT 7;".format(new_event_ids, county,state, poi_name))
    print "SELECT index, name FROM poi_detail_table_v2 WHERE index NOT IN {0} AND county='{1}' AND state='{2}' and name % '{3}' ORDER BY similarity(name, '{3}') DESC LIMIT 7;".format(event_ids, county,state, poi_name)
    results = cur.fetchall()
    poi_ids, poi_lst = [int(row[0]) for row in results], [row[1] for row in results]
    # poi_ids = convert_event_ids_to_lst(poi_ids)
    if 7-len(poi_lst)>0:
        print 'len: ', len(poi_lst)
        event_ids.extend(poi_ids)
        event_ids = str(tuple(event_ids))
        cur.execute("SELECT index, name FROM poi_detail_table_v2 WHERE index NOT IN {0} AND county='{1}' AND state='{2}' ORDER BY num_reviews DESC LIMIT {3};".format(event_ids, county,state, 7-len(poi_lst)))
        results.extend(cur.fetchall())
    poi_dict = {d[1]:d[0] for d in results}
    print poi_dict
    conn.close()
    return poi_dict

def add_event(poi_id, poi_name, trip_locations_id, full_trip_id, full_day = True, unseen_event = False):
    conn = psycopg2.connect(conn_str)   
    cur = conn.cursor()   
    cur.execute("select * from day_trip_table where trip_locations_id='%s'" %(trip_locations_id))  
    (index, trip_locations_id, full_day, regular, county, state, detail, event_type, event_ids) = cur.fetchone()
    if not poi_id:
        index += 1
        event_ids = convert_event_ids_to_lst(event_ids)
        trip_locations_id = '-'.join(event_ids)+'-'+poi_name.replace(' ','-').replace("'",'')
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

'''
Need to update db for last item delete..need to fix bugs if any
'''
def remove_event(full_trip_id, trip_locations_id, remove_event_id, username_id=1, remove_event_name=None, event_day=None, full_day = True):
    #may have some bugs if trip_locations_id != remove_event_id as last one:)   test and need to fix
    print 'init:', full_trip_id, trip_locations_id, remove_event_id
    conn = psycopg2.connect(conn_str)   
    cur = conn.cursor()

    if trip_locations_id == remove_event_id:
        if full_trip_id != trip_locations_id:
            # full_trip_id = full_trip_id[len(str(trip_locations_id))+1:]
            cur.execute("select trip_location_ids from full_trip_table where full_trip_id = '%s';" %(full_trip_id)) 
            # cur.execute("select trip_location_ids, details from full_trip_table where full_trip_id = '%s';" %(full_trip_id)) 
            trip_location_ids = cur.fetchone()[0]
            trip_location_ids = ast.literal_eval(trip_location_ids)
            trip_location_ids.remove(str(trip_locations_id))
            full_trip_details = []
            for trip_id in trip_location_ids:
                cur.execute("select details from day_trip_table where trip_locations_id = '%s';" %(trip_id)) 
                details = cur.fetchone()[0]
                trip_details = ast.literal_eval(details)
                full_trip_details.extend(trip_details)
            conn.close()
            new_full_trip_id = '-'.join(trip_location_ids)
            for index, detail in enumerate(full_trip_details):
                full_trip_details[index] = ast.literal_eval(detail)
                full_trip_details[index]['address'] = full_trip_details[index]['address'].strip(', ').replace(', ,',',')
            print full_trip_details, new_full_trip_id, trip_location_ids
            return new_full_trip_id, full_trip_details, trip_location_ids
        return '','',''
    
    
    cur.execute("select * from day_trip_table where trip_locations_id='%s'" %(trip_locations_id)) 
    (index, trip_locations_id, full_day, regular, county, state, detail, event_type, event_ids) = cur.fetchone()
    new_event_ids = convert_event_ids_to_lst(event_ids)
    remove_event_id = int(remove_event_id)
    new_event_ids.remove(remove_event_id)
    new_trip_locations_id = '-'.join(str(event_id) for event_id in new_event_ids)
    # if check_id:
    #     return new_trip_locations_id, check_id[-3]
    detail = ast.literal_eval(detail[1:-1])
    for index, trip_detail in enumerate(detail):
        if ast.literal_eval(trip_detail)['id'] == remove_event_id:
            remove_index = index
            break
    new_detail = list(detail)
    new_detail.pop(remove_index)
    new_detail =  str(new_detail).replace("'","''")
    regular = False
    cur.execute("select * from day_trip_table where trip_locations_id='%s'" %(new_trip_locations_id))  
    check_id = cur.fetchone()
    if not check_id:
        cur.execute("select max(index) from day_trip_table;")
        new_index = cur.fetchone()[0]
        new_index+=1
        cur.execute("INSERT INTO day_trip_table VALUES (%i, '%s', %s, %s, '%s', '%s', '%s', '%s','%s');" \
                    %(new_index, new_trip_locations_id, full_day, regular, county, state, new_detail, event_type, new_event_ids))  
        conn.commit()
    conn.close()
    new_full_trip_id, new_full_trip_details,new_trip_location_ids = new_full_trip_afer_remove_event(full_trip_id, trip_locations_id, new_trip_locations_id, username_id=1)
    return new_full_trip_id, new_full_trip_details,new_trip_location_ids

def new_full_trip_afer_remove_event(full_trip_id, old_trip_locations_id, new_trip_locations_id, username_id=1):
    conn = psycopg2.connect(conn_str)   
    cur = conn.cursor() 
    username_id = 1
    cur.execute("SELECT trip_location_ids, regular, county, state, details, n_days FROM full_trip_table WHERE full_trip_id = '{}' LIMIT 1;".format(full_trip_id))
    trip_location_ids, regular, county, state, details, n_days = cur.fetchone()
    trip_location_ids = ast.literal_eval(trip_location_ids)
    trip_location_ids[:] = [new_trip_locations_id if x==old_trip_locations_id else x for x in trip_location_ids]
    new_full_trip_id = '-'.join(trip_location_ids)
    new_full_trip_details = []
    for trip_locations_id in trip_location_ids:
        cur.execute("SELECT details FROM day_trip_table WHERE trip_locations_id = '{}' LIMIT 1;".format(trip_locations_id))
        detail = cur.fetchone()[0]
        detail = ast.literal_eval(detail)
        detail[:] = [ast.literal_eval(x) for x in detail]
        new_full_trip_details.extend(detail)
    regular=False
    if not check_full_trip_id(new_full_trip_id):
        cur.execute("SELECT max(index) FROM full_trip_table;")
        full_trip_index = cur.fetchone()[0] + 1
        cur.execute("INSERT INTO full_trip_table(index, username_id, full_trip_id,trip_location_ids, regular, county, state, details, n_days) VALUES (%s, %s, '%s', '%s', %s, '%s', '%s', '%s', %s);" %(full_trip_index, username_id, new_full_trip_id, str(trip_location_ids).replace("'","''"), regular, county, state, str(new_full_trip_details).replace("'","''"), n_days))
        conn.commit()
    conn.close()
    print trip_location_ids, 'before!!'
    return new_full_trip_id, new_full_trip_details,trip_location_ids

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