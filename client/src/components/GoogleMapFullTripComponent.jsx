import React, {Component} from 'react';
import { withGoogleMap, GoogleMap, Marker,DirectionsRenderer } from "react-google-maps";
import Helmet from "react-helmet";


export default class DirectionsTrip extends Component {

  constructor(props) {
    super(props);
    this.state = {
      directions: null,
      directionDetails: {},
      directionDetailsTwo: {},
      directionsTwo: null,
    };
    this.getWaypts = this.getWaypts.bind(this)
    this.getWayptsTwo = this.getWayptsTwo.bind(this)
    this.getDirections = this.getDirections.bind(this)
  }

  componentWillMount() {
    this.setState({
      directionDetails: this.getWaypts(this.props.fullTripDetails, this.props.tripLocationIds, this.props.updateTripLocationId),
      directionDetailsTwo: this.getWayptsTwo(this.props.fullTripDetails),
    });
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.fullTripDetails !== this.props.fullTripDetails)) {
      this.setState({
        directionDetails: this.getWaypts(nextProps.fullTripDetails, nextProps.tripLocationIds, nextProps.updateTripLocationId),
        directionDetailsTwo: this.getWayptsTwo(nextProps.fullTripDetails),

      });
      console.log('updateing directions: ', this.state.directionDetails, this.state.directionDetailsTwo)
    }
  }

  componentDidMount() {
    this.getDirections();
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.fullTripDetails !== this.props.fullTripDetails)) {
      console.log('map updated!')
      this.getDirections();
    }
  }

  shouldComponentUpdate(nextProps,nextState) {
      const differentFullTripDetails = nextProps.fullTripDetails !== this.props.fullTripDetails;
      const differentTripLocationId = nextProps.updateTripLocationId !== this.props.updateTripLocationId;
      const differentDirectionDetails = nextState.directions !== this.state.directions;
      return differentFullTripDetails || differentTripLocationId || differentDirectionDetails;
    }

  getWaypts = function(fullTripDetails, tripLocationIds, updateTripLocationId) {
    let waypts = [];
    const currentDay = 0;
    const oriIndex = fullTripDetails.findIndex(x => x.day == currentDay);
    const dayAry = fullTripDetails.map(function(a) {return a.day;});
    const destIndex = dayAry.lastIndexOf(currentDay);
    let origin = '';
    let location = '';
    let destination = '';
    for (let i = oriIndex; i <= destIndex; i++){
      let addressArr = fullTripDetails[i].address.split(', ');
      let newArr = [];
      for (let j = 0; j<addressArr.length-1; j++) {
        if(isNaN(addressArr[j])) {
          newArr.push(addressArr[j]);
        }
      }
      let newAddress = newArr.join(', ');
      let cityState = fullTripDetails[i].city + ', '+fullTripDetails[i].state;
      if(newAddress === cityState){
        location = fullTripDetails[i].name + ', ' + cityState;
        // console.log('no coord: ', location)
      }
      else {
        location = new google.maps.LatLng(fullTripDetails[i].coord_lat, fullTripDetails[i].coord_long);
      }
      if(i == oriIndex) {
        origin = location;
        // console.log(fullTripDetails[i], 'ori')
      }
      else if(i ==destIndex) {
        destination = location;
        // console.log(fullTripDetails[i],'dest')
      }
      else {

        waypts.push({location: location, stopover: true});
      }
    }
    return {
      origin: origin,
      destination: destination,
      waypts: waypts
    };
  }

  getWayptsTwo = function(fullTripDetails) {
    let waypts = [];
    const currentDay = 1;
    const oriIndex = fullTripDetails.findIndex(x => x.day == currentDay);
    const dayAry = fullTripDetails.map(function(a) {return a.day;});
    const destIndex = dayAry.lastIndexOf(currentDay);
    let origin = '';
    let location = '';
    let destination = '';
    for (let i = oriIndex; i <= destIndex; i++){
      let addressArr = fullTripDetails[i].address.split(', ');
      let newArr = [];
      for (let j = 0; j<addressArr.length-1; j++) {
        if(isNaN(addressArr[j])) {
          newArr.push(addressArr[j]);
        }
      }
      let newAddress = newArr.join(', ');
      let cityState = fullTripDetails[i].city + ', '+fullTripDetails[i].state;
      if(newAddress === cityState){
        location = fullTripDetails[i].name + ', ' + cityState;
        // console.log('no coord: ', location)
      }
      else {
        location = new google.maps.LatLng(fullTripDetails[i].coord_lat, fullTripDetails[i].coord_long);
      }
      if(i == oriIndex) {
        origin = location;
        // console.log(fullTripDetails[i], 'ori')
      }
      else if(i ==destIndex) {
        destination = location;
        // console.log(fullTripDetails[i],'dest')
      }
      else {

        waypts.push({location: location, stopover: true});
      }
    }
    return {
      origin: origin,
      destination: destination,
      waypts: waypts
    };
  }

  getDirections() {
    // console.log('get directions')
    const DirectionsService = new google.maps.DirectionsService();
    const DirectionsServiceTwo = new google.maps.DirectionsService();
    if(this.state.directionDetails.origin){ 
      DirectionsService.route({
        origin: this.state.directionDetails.origin,
        destination: this.state.directionDetails.destination,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: this.state.directionDetails.waypts,
        optimizeWaypoints: true,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directionsTwo: result,
          });
          console.log('reuslt 1: ', result)
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
      DirectionsServiceTwo.route({
        origin: this.state.directionDetailsTwo.origin,
        destination: this.state.directionDetailsTwo.destination,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: this.state.directionDetailsTwo.waypts,
        optimizeWaypoints: true,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
          console.log('reuslt 2: ', result)
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
      console.log('loop thru directions two!')
    }
  }

  render() {
    console.log('map re-renderred')
    const DirectionsGoogleMap = withGoogleMap(props => (
      <GoogleMap
        defaultZoom={7}
        defaultCenter={this.state.center}
      >
        {this.state.directions && <DirectionsRenderer directions={this.state.directions} />}
        {this.state.directions && <DirectionsRenderer directions={this.state.directionsTwo} />}
      </GoogleMap>
    ));
    // this.getDirections();

    return (
      <DirectionsGoogleMap
        containerElement={
          <div style={{ height: `100%` }} />
        }
        mapElement={
          <div style={{ height: `100%` }} />
        }
        center={this.state.directionDetails.origin}
      />
    );
  }
}