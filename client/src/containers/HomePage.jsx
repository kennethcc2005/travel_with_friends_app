import React from 'react';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import SearchCityState from '../components/SearchCityState.jsx';
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
      cityStateDataSource : [],
      searchInputValue : '',
      daysValue: '1',
      fullTripDetails: [],
      fullTripId: '',
    };
    this.performSearch = this.performSearch.bind(this)
    this.onUpdateInput = this.onUpdateInput.bind(this)
    this.handleDaysOnChange = this.handleDaysOnChange.bind(this)
    this.onFullTripSubmit = this.onFullTripSubmit.bind(this)
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
        });
      });
    };
  }

  render() { 
    return (
      <Card className="container">
        <CardTitle title="Travel with Friends!" subtitle="This is the home page." />
        <CardActions>
            <div className="col-md-8 col-md-offset-2">
                <div className="col-md-5">
                    <SearchCityState searchText={this.state.searchInputValue}
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
                    {this.state.fullTripDetails.length>0 && <FullTripList daysValue={this.state.daysValue} fullTripDetails={this.state.fullTripDetails}/>}
                </div>
            </div>
            
        </CardActions>
      </Card>
    )
  }
};


export default HomePage;
