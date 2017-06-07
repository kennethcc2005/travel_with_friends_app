import React from 'react';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import SearchInputField from '../components/SearchInputField.jsx';
import MenuItemDays from '../components/MenuItemDays.jsx';
import FullTripSearchButton from '../components/FullTripSearchButton.jsx';
import FullTripList from '../components/FullTripList.jsx';
import FullTripAddEventButton from '../components/FullTripAddEventButton.jsx';
import FullTripResetButton from '../components/FullTripResetButton.jsx';
import FullTripConfirmButton from '../components/FullTripConfirmButton.jsx';
import DirectionsTrip from '../components/GoogleMapComponent.jsx';
// Version B: Delete method showed in front end only, dont update the backend until final click. Beter for performance!
// add_search event use local search instead of calling backend for updates.!
// alot to updates...>__<
// Version C: update backend for the add event order or use front end to do so
// import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

// const SimpleMapExampleGoogleMap = withGoogleMap(props => (
//   <GoogleMap
//     defaultZoom={8}
//     defaultCenter={{ lat: -34.397, lng: 150.644 }}
//   />
// ));

const divStyle = {
  width: '100%',
  height: '400px',
};


class HomePage extends React.Component {
  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);
    // set the initial component state
    this.state = {
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
      a: '',

    };
    this.performSearch = this.performSearch.bind(this)
    this.onUpdateInput = this.onUpdateInput.bind(this)
    this.handleDaysOnChange = this.handleDaysOnChange.bind(this)
    this.onFullTripSubmit = this.onFullTripSubmit.bind(this)
    this.onDeleteEvent = this.onDeleteEvent.bind(this)
    this.onSuggestEvent = this.onSuggestEvent.bind(this)
    this.onFullTripReset = this.onFullTripReset.bind(this)
    this.onFullTripConfirm = this.onFullTripConfirm.bind(this)
    this.performDeleteEventId = this.performDeleteEventId.bind(this)
    this.performSuggestEventLst = this.performSuggestEventLst.bind(this)
    this.onAddEventInput = this.onAddEventInput.bind(this)
    this.getTapName = this.getTapName.bind(this)
    this.onAddEventSubmit = this.onAddEventSubmit.bind(this)
  }
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
  onUpdateInput(searchInputValue) {
    this.setState({
        searchInputValue,
      },function(){
      this.performSearch();
    });
  }
  handleDaysOnChange = (event, index, value) => this.setState({ daysValue: event.target.innerText});

  onFullTripSubmit = () => {
    const dbLocationURI = 'http://127.0.0.1:8000/full_trip_search/?';
    const _this = this;
    const city = this.state.searchInputValue.split(', ')[0];
    const state = this.state.searchInputValue.split(', ')[1];
    const valid_city_input = encodeURIComponent(city);
    const valid_state_input = encodeURIComponent(state);
    const myUrl = dbLocationURI + 'city=' + valid_city_input + '&state='+ valid_state_input
                +'&n_days='+ this.state.daysValue;
    if(this.state.searchInputValue !== '') {
      $.ajax({
        type: "GET",
        url: myUrl,
      }).done(function(res) {
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
    console.log('post suggest event!')
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
        console.log('before state: ',suggestEventArr, suggestEvent)
        _this.setState({
          suggestEventArr: suggestEventArr,
          updateSuggestEvent: updateSuggestEvent,
        });
        console.log('suggest event: ',_this.state.suggestEventArr, _this.state.updateSuggestEvent)
      });
    };
  }

  onFullTripReset(){
    this.setState({
      // updateSuggestEvent: {}
      a:'',
    })
  }

  onFullTripConfirm(){

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
  

  render() { 
    return (
      <Card className="container" >
        <CardTitle title="Travel with Friends!" subtitle="This is the home page." />
        <CardActions>
          
          <div className="col-md-8 col-md-offset-2">
            <div className="col-md-5">
              <SearchInputField 
                name ='searchCityState'
                searchText={this.state.searchInputValue}
                floatingLabelText='Location' 
                dataSource={this.state.cityStateDataSource} 
                onUpdateInput={this.onUpdateInput} />
            </div>
            <div className="col-md-5">
              <MenuItemDays daysValue={this.state.daysValue} handleDaysOnChange={this.handleDaysOnChange}/>
            </div>
            <div className="col-md-2">
              <FullTripSearchButton onFullTripSubmit={this.onFullTripSubmit}/>
            </div>
            <br/>
            <div className="col-md-12 ">
              {this.state.fullTripDetails.length>0 && 
                <FullTripList 
                  onDeleteEvent={this.onDeleteEvent} 
                  onSuggestEvent={this.onSuggestEvent}
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
                  {this.state.fullTripDetails.length>0 && 
                    <FullTripResetButton onFullTripReset={this.onFullTripReset}/>}
                </div>
                <div className="col-md-4">
                  {this.state.fullTripDetails.length>0 && 
                    <FullTripConfirmButton onFullTripConfirm={this.onFullTripConfirm}/>}
                </div>
              </div>
              
            </div>
            <div className="col-md-12">
                <div style={divStyle}>
                  {this.state.fullTripDetails.length > 0 && <DirectionsTrip fullTripDetails={this.state.fullTripDetails}
                                                                            updateTripLocationId={this.state.updateTripLocationId}
                                                                            tripLocationIds={this.state.tripLocationIds} />}
                </div>
              </div>            
          </div>
            
        </CardActions>
      </Card>
    )
  }
};


export default HomePage;
