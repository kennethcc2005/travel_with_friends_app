import React from 'react';
import { Card, CardTitle, CardActions, CardText, CardMedia } from 'material-ui/Card';
import SearchInputField from '../components/SearchInputField.jsx';
import MenuItemDays from '../components/MenuItemDays.jsx';
import MenuItemDirections from '../components/MenuItemDirections.jsx';
import FullTripSearchButton from '../components/FullTripSearchButton.jsx';
import FullTripList from '../components/FullTripList.jsx';
import FullTripAddEventButton from '../components/FullTripAddEventButton.jsx';
import FullTripResetButton from '../components/FullTripResetButton.jsx';
import FullTripConfirmButton from '../components/FullTripConfirmButton.jsx';
import DirectionsTrip from '../components/GoogleMapComponent.jsx';
import FullDirectionsTrip from '../components/GoogleMapFullTripComponent.jsx';
import GoogleMapUrlButton from '../components/GoogleMapUrlButton.jsx';
import FullTripUserSubmitButton from '../components/FullTripUserSubmitButton.jsx';
import UserStore from '../stores/UserStore.jsx';

import TripConstants from '../constants/TripConstants.jsx';
import {GridList, GridTile} from 'material-ui/GridList';
import OutsideTripGrid from '../components/OutsideTripGrid.jsx';

// Version B: Delete method showed in front end only, dont update the backend until final click. Beter for performance!
// add_search event use local search instead of calling backend for updates.!
// alot to updates...>__<
// Version C: update backend for the add event order or use front end to do so


// Bug to be fixed: full trip list disappear when prev state with trip_days >1, tab on day 2 or larger
// and changes trip_days lower to 1.
const divStyle = {
  width: '100%',
  height: '400px',
};

class OutsideTripPage extends React.Component {
  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);
    // set the initial component state
    this.state = {
      ipCity: localStorage.ip_city,
      ipState: localStorage.ip_state,
      ip: localStorage.ip,
      directionValue: '',
      updateOutsideTripId: '',

      place: "",
      days: "",
      cityStateDataSource: [],
      addEventDataSource: [],
      poiDict: {},
      searchInputValue: '',
      searchEventValue: '',
      daysValue: '1',
      fullTripDetails: [],
      fullTripId: '',
      tripLocationIds: [],
      cloneFullTripDetails: [],
      updateEventId: '',
      updateTripLocationId: '',
      suggestEventArr: {},
      updateSuggestEvent: {},
      currentMapUrl: '',
      newFullTrip: '',


    };
    this.getOutsideTripTileTapName = this.getOutsideTripTileTapName.bind(this)
    this.handleDirectionsOnChange = this.handleDirectionsOnChange.bind(this)
    this.onOutsideTripSubmit = this.onOutsideTripSubmit.bind(this)

    this.performSearch = this.performSearch.bind(this)
    this.onUpdateInput = this.onUpdateInput.bind(this)

    this.onFullTripUserSubmit = this.onFullTripUserSubmit.bind(this)
    this.onDeleteEvent = this.onDeleteEvent.bind(this)
    this.onSuggestEvent = this.onSuggestEvent.bind(this)
    this.onFullTripReset = this.onFullTripReset.bind(this)
    this.onFullTripConfirm = this.onFullTripConfirm.bind(this)
    this.performDeleteEventId = this.performDeleteEventId.bind(this)
    this.performSuggestEventLst = this.performSuggestEventLst.bind(this)
    this.onAddEventInput = this.onAddEventInput.bind(this)
    this.getTapName = this.getTapName.bind(this)
    this.getMapUrl = this.getMapUrl.bind(this)
    this.onAddEventSubmit = this.onAddEventSubmit.bind(this)
    this.searchAPILocation = this.searchAPILocation.bind(this)
  }

  // For both full trip and outside trip
  performSearch() {
    const dbLocationURI = 'http://127.0.0.1:8000/city_state_search/?city_state=';
    const _this = this;
    const valid_input = encodeURIComponent(this.state.searchInputValue);
    const myUrl = dbLocationURI + valid_input;

    if(this.state.searchInputValue !== '') {
      console.log(myUrl);
      $.ajax({
        type: "GET",
        url: myUrl,
      }).done(function(res) {
        _this.setState({
          cityStateDataSource : res.city_state,  
        });
      });
    };
  }

  // For both full trip and outside trip
  onUpdateInput(searchInputValue) {
    this.setState({
        searchInputValue,
      },function(){
      this.performSearch();
    });
  }

  //outside trip only 
  onOutsideTripSubmit = () => {
    const dbLocationURI = 'http://127.0.0.1:8000/outside_trip_search/?';
    const _this = this;
    const city = this.state.searchInputValue.split(', ')[0];
    const state = this.state.searchInputValue.split(', ')[1];
    const valid_city_input = encodeURIComponent(city);
    const valid_state_input = encodeURIComponent(state);
    const myUrl = dbLocationURI + 'city=' + valid_city_input + '&state='+ valid_state_input
                +'&direction='+ this.state.directionValue;
    console.log('outside trip: ',myUrl)
    if(this.state.searchInputValue !== '') {
      $.ajax({
        type: "GET",
        url: myUrl,
      }).done(function(res) {
        console.log('outside result: ', res)
        _this.setState({
          fullTripDetails : res.full_trip_details,  
          fullTripId: res.full_trip_id,
          tripLocationIds: res.trip_location_ids,
          updateTripLocationId: res.trip_location_ids[0],
          addEventDataSource: [],
          poiDict: {},
          searchEventValue: '',
        });
        // call a func: map fulltrip detail to clone => cloneFullTripDetails = 
      });
    };
  }

  

  //may want to reset!
  performDeleteEventId() {
    const { fullTripId, updateEventId, updateTripLocationId } = this.state;
    const myUrl = 'http://127.0.0.1:8000/update_trip/delete/?full_trip_id=' + fullTripId +
                        '&event_id=' + updateEventId +
                        '&trip_location_id='+ updateTripLocationId;
    const _this = this;
    if(updateEventId !== '') {
      console.log(myUrl);
      $.ajax({
        type: "GET",
        url: myUrl,
      }).done(function(res) {
        _this.setState({
          fullTripDetails : res.full_trip_details,  
          fullTripId: res.full_trip_id,
          tripLocationIds: res.trip_location_ids,
          updateTripLocationId: res.current_trip_location_id,
          updateEventId: '',
        });
      });
    };
  }
  onDeleteEvent(updateEventId, updateTripLocationId) {
    this.setState({
        updateEventId,
        updateTripLocationId
      },this.performDeleteEventId);
  }

  onSuggestEvent(updateEventId, updateTripLocationId) {
    console.log('suggest event!')
    if (this.state.suggestEventArr.hasOwnProperty(updateEventId)) {
      const suggestEventArrLength = Object.keys(this.state.suggestEventArr).length
      const randomSuggestEventArrIdx = Math.floor(Math.random()*suggestEventArrLength)
      const suggestEvent = this.state.suggestEventArr[randomSuggestEventArrIdx];
      const updateSuggestEvent = Object.assign({}, this.state.updateSuggestEvent, {[this.state.updateEventId]:suggestEvent});
      this.setState({
        updateEventId,
        // updateTripLocationId: updateTripLocationId,
        updateSuggestEvent,
      }); 
    } else {
      this.setState({
        updateEventId,
        // updateTripLocationId
      }, this.performSuggestEventLst);
    }
  }

  performSuggestEventLst(){
    
    const myUrl = 'http://127.0.0.1:8000/update_trip/suggest_search/?full_trip_id=' + this.state.fullTripId +
                        '&event_id=' + this.state.updateEventId +
                        '&trip_location_id='+this.state.updateTripLocationId;
    const _this = this;
    if(_this.state.updateEventId !== '') {
      console.log(myUrl);
      $.ajax({
        type: "GET",
        url: myUrl,
      }).done(function(res) {
        let suggestEventArr = Object.assign({}, _this.state.suggestEventArr[_this.state.updateEventId], res.suggest_event_array);
        let suggestEvent = suggestEventArr[Math.floor(Math.random()*Object.keys(suggestEventArr).length)];
        let updateSuggestEvent = Object.assign({}, _this.state.updateSuggestEvent, {[_this.state.updateEventId]:suggestEvent});
        _this.setState({
          suggestEventArr: suggestEventArr,
          updateSuggestEvent: updateSuggestEvent,
        });
      });
    };
  }

  onFullTripReset(){
    this.setState({
      updateSuggestEvent: {}
    })
  }

  onFullTripConfirm(){
    const suggestConfirmUrl = 'http://127.0.0.1:8000/update_trip/suggest_confirm/';
    const _this = this;

    let data = {
      updateSuggestEvent: JSON.stringify(this.state.updateSuggestEvent),
      fullTripId: this.state.fullTripId,
      updateTripLocationId: this.state.updateTripLocationId,
    };
    // data = JSON.stringify(data)
    $.ajax({
      type: 'POST',
      url: suggestConfirmUrl,
      data: data
    })
    .done(function(res) {
      _this.setState({
        updateSuggestEvent: '',
        fullTripDetails: res.full_trip_details,
        fullTripId: res.full_trip_id,
        tripLocationIds: res.trip_location_ids,
        updateEventId: '',
        updateTripLocationId: res.current_trip_location_id,
      })
    })
    .fail(function(jqXhr) {
      console.log('failed to register');
    });

  }

  performAddEventSearch() {
    const dbLocationURI = 'http://127.0.0.1:8000/update_trip/add_search/?poi_name=';
    const _this = this;
    const validInput = encodeURIComponent(this.state.searchEventValue);
    const myUrl = dbLocationURI + validInput + 
                    '&trip_location_id=' + this.state.updateTripLocationId +
                    '&full_trip_id=' + this.state.fullTripId;
    if(this.state.searchEventValue !== '') {
      console.log('add url: ', myUrl);
      $.ajax({
        type: "GET",
        url: myUrl,
      }).done(function(res) {
        _this.setState({
          addEventDataSource : res.poi_names,  
          poiDict: res.poi_dict,
        });

      });
    };
  }
  onAddEventInput(searchEventValue) {
    this.setState({
        searchEventValue,
      },function(){
      this.performAddEventSearch();
    });
  }

  getTapName(updateTripLocationId) {
    this.setState({
        updateTripLocationId: updateTripLocationId,
        addEventDataSource: [],
        searchEventValue: '',
    });
  }

  getMapUrl(currentMapUrl) {
    console.log('the currentMapUrl: ',currentMapUrl)
    this.setState({
      currentMapUrl
    })
  }

  onAddEventSubmit = () => {
    const dbLocationURI = 'http://127.0.0.1:8000/update_trip/add/?';
    const _this = this;
    const poiId = this.state.poiDict[this.state.searchEventValue];
    const validPoiName = encodeURIComponent(this.state.searchEventValue);
    const myUrl = dbLocationURI + 'poi_id=' + poiId + '&poi_name='+ validPoiName
                +'&full_trip_id='+ this.state.fullTripId +
                '&trip_location_id='+this.state.updateTripLocationId;
    console.log(myUrl)
    if(this.state.searchEventValue !== '') {
      $.ajax({
        type: "GET",
        url: myUrl,
      }).done(function(res) {
        _this.setState({
          fullTripDetails : res.full_trip_details,  
          fullTripId: res.full_trip_id,
          tripLocationIds: res.trip_location_ids,
          updateTripLocationId: res.current_trip_location_id,
          addEventDataSource: [],
          searchEventValue: '',
        });
        // call a func: map fulltrip detail to clone => cloneFullTripDetails = 
      });
    };
  }
  // Wrap all `react-google-maps` components with `withGoogleMap` HOC
  // and name it GettingStartedGoogleMap
  
  onFullTripUserSubmit = () =>  {
    const fullTripUrl = 'http://localhost:8000/create_full_trip/';
    const token = localStorage.getItem('user_token')
    // const headers = {
    //                 'Authorization': 'Token ' + UserStore.token
    //                 }
    const headers = {
    'Authorization': 'Token ' + localStorage.user_token
    }
    const _this = this;
    console.log('headers: ', headers)
    let data = {
      fullTripId: this.state.fullTripId,
    };
    // data = JSON.stringify(data)
    $.ajax({
      type: 'POST',
      url: fullTripUrl,
      data: data,
      headers: headers,
    })
    .done(function(res) {
      _this.setState({
        updateSuggestEvent: '',
        updateEventId: '',
        newFullTrip: res.response,
      })
      console.log('done creating the full trip!', 'new full trip?: ', _this.state.newFullTrip)
    })
    .fail(function(jqXhr) {
      console.log('failed to create the full trip.');
    });

  }

  searchAPILocation(){
    const _this = this;
    $.getJSON('https://api.ipify.org?format=json', function(data){
      if (localStorage.getItem('ip') != data.ip) {
        const ipLocationURL = TripConstants.IP_LOCATION_URL + data.ip
        console.log(data.ip, ipLocationURL);
        $.ajax({
            url: ipLocationURL,
            headers: {
              'Accept': 'application/json'
            },
            type: "GET", /* or type:"GET" or type:"PUT" */
            dataType: "json",
            data: {
            },
            success: function (result) {
              localStorage.setItem('ip',data.ip);
              localStorage.setItem('ip_state',result.region_name);
              localStorage.setItem('ip_city',result.city_name);
            },
            error: function () {
              console.log("error", ipLocationURL);
            }
          });
      }
    })
  }

  handleDirectionsOnChange = (event, index, value) => this.setState({ directionValue: value});

  componentWillMount(){
    this.searchAPILocation();  
    const tripDirections = ['N','W','E','S'];
    const randomDirectionIdx = Math.floor(Math.random()*tripDirections.length);
    this.setState({
      searchInputValue: this.state.ipCity + ', ' + this.state.ipState,
      directionValue: tripDirections[randomDirectionIdx]
    }) 
  }

  getOutsideTripTileTapName(updateOutsideTripId) {
    this.setState({
        updateOutsideTripId: updateOutsideTripId,
        addEventDataSource: [],
        searchEventValue: '',
    });
    console.log(updateOutsideTripId, 'aha')
  }

  render() { 
    return (
      <Card className="container" >
        <div className="col-md-12">
          <CardActions>
            <div className="col-md-8 col-md-offset-2">
              <div className="col-md-5">
                <SearchInputField 
                  name ='searchCityState'
                  searchText={this.state.searchInputValue}
                  floatingLabelText='Current Location' 
                  dataSource={this.state.cityStateDataSource} 
                  onUpdateInput={this.onUpdateInput} 
                  />

              </div>
              <div className="col-md-5">
                <MenuItemDirections directionValue={this.state.directionValue} handleDirectionsOnChange={this.handleDirectionsOnChange}/>

              </div>
              <div className="col-md-2">
                <FullTripSearchButton onFullTripSubmit={this.onOutsideTripSubmit}/>
              </div>
              <div className="col-md-12">
                <OutsideTripGrid getOutsideTripTileTapName={this.getOutsideTripTileTapName} />
              </div>
            </div>

          </CardActions>
        </div>
        <br />






        <div className="col-md-12">
          <br/>
          <CardTitle title="Travel with Friends!" subtitle="Explore fun places around your area." />
          <CardText>
            Pick the city and the direction to explore.  You will find great funs.
          </CardText>

          <CardMedia
            overlay={<CardTitle title="Chicago is Fun" subtitle="Here is the picture" />}
          >
            <img src="images/nature-600-337.jpg" alt="" />
          </CardMedia>

          <CardActions>
            <div className="col-md-8 col-md-offset-2">
              <div className="col-md-12 ">
                {this.state.fullTripDetails.length>0 && 
                  <FullTripList 
                    onDeleteEvent={this.onDeleteEvent} 
                    onSuggestEvent={this.onSuggestEvent}
                    updateSuggestEvent={this.state.updateSuggestEvent}
                    fullTripDetails={this.state.fullTripDetails} 
                    tripLocationIds={this.state.tripLocationIds}
                    getTapName={this.getTapName} 
                    />}
              </div>
              <div className="col-md-10 col-md-offset-2">
                <div className="col-md-5 col-md-offset-1">
                  {this.state.fullTripDetails.length>0 && 
                    <SearchInputField
                      name = 'searchAddEvent'
                      searchText={this.state.searchEventValue}
                      hintText='Add New Event'
                      inputStyle={{ textAlign: 'center' }}
                      dataSource={this.state.addEventDataSource} 
                      onUpdateInput={this.onAddEventInput} />}
                </div>
                <div className="col-md-2">
                  {this.state.fullTripDetails.length>0 && 
                    <FullTripAddEventButton onAddEventSubmit={this.onAddEventSubmit}/>}
                </div>
                <div className="col-md-4">
                  <div className="col-md-4">
                    {Object.keys(this.state.updateSuggestEvent).length>0 && 
                      <FullTripResetButton onFullTripReset={this.onFullTripReset}/>}
                  </div>
                  <div className="col-md-4">
                    {Object.keys(this.state.updateSuggestEvent).length>0 && 
                      <FullTripConfirmButton onFullTripConfirm={this.onFullTripConfirm}/>}
                  </div>
                </div>
                
              </div>
              <div className="col-md-12">
                <div style={divStyle}>
                    {this.state.fullTripDetails.length > 0 && <DirectionsTrip fullTripDetails={this.state.fullTripDetails}
                                                                              updateTripLocationId={this.state.updateTripLocationId}
                                                                              tripLocationIds={this.state.tripLocationIds} 
                                                                              getMapUrl={this.getMapUrl} />}
                </div>

                <br />
                <div className="col-md-6">
                  {this.state.currentMapUrl.length >0 && <GoogleMapUrlButton googleMapUrl={this.state.currentMapUrl} />}
                </div>
                <div className="col-md-6">
                  {this.state.currentMapUrl.length >0 && <FullTripUserSubmitButton onFullTripUserSubmit={this.onFullTripUserSubmit} />}
                </div>

              </div>            
            </div>
              
          </CardActions>
        </div>
      </Card>
    )
  }
};


export default OutsideTripPage;
