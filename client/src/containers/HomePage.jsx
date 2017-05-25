import React from 'react';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import SearchInputField from '../components/SearchInputField.jsx';
import MenuItemDays from '../components/MenuItemDays.jsx';
import FullTripSearchButton from '../components/FullTripSearchButton.jsx'
import FullTripList from '../components/FullTripList.jsx'
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
      searchInputValue: '',
      searchEventValue: '',
      daysValue: '1',
      fullTripDetails: [],
      fullTripId: '',
      tripLocationIds: [],
      cloneFullTripDetails: [],
      updateEventId: '',
      updateTripLocationId: '',
    };
    this.performSearch = this.performSearch.bind(this)
    this.onUpdateInput = this.onUpdateInput.bind(this)
    this.handleDaysOnChange = this.handleDaysOnChange.bind(this)
    this.onFullTripSubmit = this.onFullTripSubmit.bind(this)
    this.onDeleteEvent = this.onDeleteEvent.bind(this)
    this.performDeleteEventId = this.performDeleteEventId.bind(this)
    this.onAddEventInput = this.onAddEventInput.bind(this)
    this.getTapName = this.getTapName.bind(this)
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
          searchEventValue: '',
        });
        // call a func: map fulltrip detail to clone => cloneFullTripDetails = 
      });
    };
  }

  performDeleteEventId() {
    const myUrl = 'http://127.0.0.1:8000/update_trip/delete/?full_trip_id=' + this.state.fullTripId +
                        '&event_id=' + this.state.updateEventId +
                        '&trip_location_id='+this.state.updateTripLocationId;
    const _this = this;
    if(this.state.updateEventId !== '') {
      console.log(myUrl);
      $.ajax({
        type: "GET",
        url: myUrl,
      }).done(function(res) {
        _this.setState({
          fullTripDetails : res.full_trip_details,  
          fullTripId: res.full_trip_id,
          tripLocationIds: res.trip_location_ids,
          updateEventId: '',
          updateTripLocationId: '',
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

  performAddEventSearch() {
    const dbLocationURI = 'http://127.0.0.1:8000/update_trip/add_search/?poi_name=';
    const _this = this;
    const valid_input = encodeURIComponent(this.state.searchEventValue);
    const myUrl = dbLocationURI + valid_input + 
                    '&trip_location_id=' + this.state.updateTripLocationId +
                    '&full_trip_id=' + this.state.fullTripId;
    if(this.state.searchEventValue !== '') {
      console.log('add url: ', myUrl);
      $.ajax({
        type: "GET",
        url: myUrl,
      }).done(function(res) {
        _this.setState({
          addEventDataSource : res.poi_list,  
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

  render() { 
    return (
      <Card className="container">
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
                        <FullTripList onDeleteEvent={this.onDeleteEvent} 
                                      fullTripDetails={this.state.fullTripDetails} 
                                      tripLocationIds={this.state.tripLocationIds}
                                      getTapName={this.getTapName} 
                                      />}
                    
                </div>
                <div className="col-md-4 col-md-offset-4">
                    {this.state.fullTripDetails.length>0 && 
                        <SearchInputField
                            name = 'searchAddEvent'
                            searchText={this.state.searchEventValue}
                            hintText='Add New Event'
                            inputStyle={{ textAlign: 'center' }}
                            dataSource={this.state.addEventDataSource} 
                            onUpdateInput={this.onAddEventInput} />}
                </div>
                <br/>
                <div className="col-md-12 ">
                    {this.state.fullTripDetails.length>0 && 
                        <FullTripList onDeleteEvent={this.onDeleteEvent} 
                                      fullTripDetails={this.state.fullTripDetails} 
                                      tripLocationIds={this.state.tripLocationIds}
                                      getTapName={this.getTapName} 
                                      />}
                    
                </div>
                {console.log(this.state.updateTripLocationId, 'aaa',this.state.tripLocationIds)}
            </div>
            
        </CardActions>
      </Card>
    )
  }
};


export default HomePage;
