#Get events outside the city!!!
import numpy as np
from distance import *
from outside_helpers import *
'''
Outside trip table: user_id, outside_trip_id, route_ids, origin_city, state, direction, n_days, default, full_day, details 
outside route table: route_id, event_id_lst, event_type, origin_city, state, direction, details, default, 
'''
# target_direction = 'N'
# origin_city = 'San Francisco'
# origin_state = 'California'
# conn_str = "dbname='travel_with_friends' user='zoesh' host='localhost'"

def outside_trip_poi(origin_city, origin_state, target_direction = 'N', \
                    full_day = True, regular = True, debug = True, username_id = 1, n_days = 1):
    outside_trip_id = '-'.join([str(origin_state.upper().replace(' ','-')), str(origin_city.upper().replace(' ','-')), \
                        target_direction,str(int(regular))])
    if not check_outside_trip_id(outside_trip_id, debug):
        furthest_len = 100
        if n_days == 1:
            furthest_len = 100
        #possible city coords, target city coord_lat, target city coord_long
        # city_id, coords, coord_lat, coord_long = travel_outside_coords(origin_city, origin_state)
        #coords: city, lat, long
        # check_cities_info = []
        # for item in coords:
        #     direction = direction_from_orgin(coord_long,  coord_lat, item[2], item[1])
        #     if (target_direction == direction) and (geopy_dist((item[1], item[2]), (coord_lat, coord_long)) < furthest_len):
        #         check_cities_info.append(item)
        # city_infos = []
        # for city, _, _ in check_cities_info:
        #     county = None
        #     #index, coord0, coord1, adjusted_normal_time_spent, poi_rank, rating
        #     city_info = db_start_location(county, origin_state, city)
        #     city_infos.extend(city_info)
        city_id, coord_lat, coord_long, city_infos = travel_outside_with_direction(origin_city, origin_state, target_direction, furthest_len, n_days=1)
        if len(city_infos)<=0:
            conn = psycopg2.connect(conn_str)
            cur = conn.cursor()
            cur.execute('SELECT MAX(index) from outside_trip_table;')
            new_index = cur.fetchone()[0] +1
            cur.execute("INSERT into outside_trip_table(index, username_id, outside_trip_id, outside_route_ids, event_id_lst, origin_city, origin_state, target_direction, n_routes, regular, full_day, details) \
                         VALUES (%s,'%s', '%s', '%s','%s', '%s', '%s', '%s', %s,%s,%s,'%s');" \
                         %(new_index, username_id, outside_trip_id, '[]', '[]', origin_city, origin_state, target_direction, 0, regular, full_day, '[]'))
            conn.commit()
            conn.close()
            print "finish update None for %s, %s, direction %s into database" %(origin_state, origin_city, target_direction)
            return None
        # city_infos = np.array(city_infos)
        poi_coords = city_infos[:,1:3]
        n_routes = sum(1 for t in np.array(city_infos)[:,3] if t >= 120)/10
        print 'poi details: ',np.array(city_infos).shape, n_routes
        if (n_routes>1) and (city_infos.shape[0]>=10):
            kmeans = KMeans(n_clusters=n_routes).fit(poi_coords)
        elif (city_infos.shape[0]> 20) or (n_routes>1):
            kmeans = KMeans(n_clusters=2).fit(poi_coords)
        else:
            kmeans = KMeans(n_clusters=1).fit(poi_coords)
        route_labels = kmeans.labels_
        # print n_routes, len(route_labels), city_infos.shape
        # print route_labels
        outside_route_ids, outside_trip_details,event_id_lst =[],[],[]
        for i in range(n_routes):
            current_events, big_ix, med_ix, small_ix = [], [],[], []
            for ix, label in enumerate(route_labels):
                if label == i:
                    time = city_infos[ix,3]
                    event_ix = city_infos[ix,0]
                    current_events.append(event_ix)
                    if time > 180 :
                        big_ix.append(ix)
                    elif time >= 120 :
                        med_ix.append(ix)
                    else:
                        small_ix.append(ix)
            big_ = sorted_outside_events(city_infos, big_ix)
            med_ = sorted_outside_events(city_infos, med_ix)
            small_ = sorted_outside_events(city_infos, small_ix)
            # need to update!!!!!!!!
            event_ids, event_type = create_outside_event_id_list(big_, med_, small_)
            event_ids, event_type = db_outside_event_cloest_distance(coord_lat, coord_long, event_ids = event_ids, event_type = event_type)
            event_ids, google_ids, name_list, driving_time_list, walking_time_list =db_outside_google_driving_walking_time(city_id, coord_lat,coord_long, event_ids, event_type, origin_city = origin_city, origin_state = origin_state)
            #why bug????
            event_ids, driving_time_list, walking_time_list, total_time_spent = db_remove_outside_extra_events(event_ids, driving_time_list, walking_time_list)
            outside_route_id = outside_trip_id + '-'+str(i)
#             values = db_outside_route_trip_details(outside_route_id, event_ids, origin_city, origin_state, regular, full_day,n_days,i)
            if check_outside_route_id(outside_route_id):
                conn = psycopg2.connect(conn_str)
                cur = conn.cursor()
                cur.execute("DELETE FROM outside_route_table WHERE outside_route_id = '%s';" %(outside_route_id))
                conn.commit()
                conn.close()
            details = db_outside_route_trip_details(event_ids,i)
            conn = psycopg2.connect(conn_str)
            cur = conn.cursor()
            cur.execute('select max(index) from outside_route_table;')
            new_index = cur.fetchone()[0] + 1
            cur.execute("insert into outside_route_table (index, outside_route_id, full_day, regular, origin_city, origin_state, target_direction, details, event_type, event_ids, route_num) \
                        VALUES (%s, '%s', %s, %s, '%s', '%s', '%s', '%s', '%s', '%s', %s);" \
                        %(new_index, outside_route_id, full_day, regular, origin_city, origin_state, target_direction, str(details).replace("'","''"), event_type, str(event_ids) , i))
            conn.commit()
            conn.close()
            outside_route_ids.append(outside_route_id)
            outside_trip_details.extend(details)
            event_id_lst.extend(event_ids)

        username_id = 1
        conn = psycopg2.connect(conn_str)
        cur = conn.cursor()
        cur.execute('SELECT MAX(index) from outside_trip_table;')
        new_index = cur.fetchone()[0] +1
        cur.execute("INSERT into outside_trip_table(index, username_id, outside_trip_id, outside_route_ids, event_id_lst, origin_city, origin_state, target_direction, n_routes, regular, full_day, details) \
                     VALUES (%s,'%s', '%s', '%s','%s', '%s', '%s', '%s', %s,%s,%s,'%s');" \
                     %(new_index, username_id, outside_trip_id, str(outside_route_ids).replace("'","''"), str(event_id_lst), origin_city, origin_state, target_direction, n_routes, regular, full_day, str(outside_trip_details).replace("'","''")))
        conn.commit()
        conn.close()
        print "finish update %s, %s, direction %s into database" %(origin_state, origin_city, target_direction)
        return outside_trip_id, outside_trip_details
    else:
        print "ALERT: %s, %s, direction %s already in database" %(origin_state, origin_city, target_direction)
        conn = psycopg2.connect(conn_str)
        cur = conn.cursor()
        cur.execute("SELECT DISTINCT outside_trip_id, details FROM outside_trip_table WHERE outside_trip_id = '%s';" %(outside_trip_id))
        outside_trip_id, details = cur.fetchone()
        details = ast.literal_eval(details)
        conn.close()
        return outside_trip_id, details

if __name__ == '__main__':
    import time
    start_t = time.time()
    direct = ["E","S","W","N"]
    origin_city = 'San Francisco'
    origin_state = 'California'
    print origin_city, origin_state
    for target_direction in direct:
        outside_trip_poi(origin_city,origin_state, target_direction)

    print time.time()-start_t
