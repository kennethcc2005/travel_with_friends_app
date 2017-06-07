import React, {Component} from 'react';
import { withGoogleMap, GoogleMap, Marker,DirectionsRenderer } from "react-google-maps";
import Helmet from "react-helmet";


export default class DirectionsTrip extends Component {

  constructor(props) {
    super(props);
    this.state = {
      directions: null,
      directionDetails: {},
    };
    this.getWaypts = this.getWaypts.bind(this)
    this.getDirections = this.getDirections.bind(this)
  }

  componentWillMount() {
    this.setState({directionDetails: this.getWaypts(this.props.fullTripDetails, this.props.tripLocationIds, this.props.updateTripLocationId)});
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.fullTripDetails !== this.props.fullTripDetails) || ((nextProps.updateTripLocationId !== this.props.updateTripLocationId))) {
      this.setState({directionDetails: this.getWaypts(nextProps.fullTripDetails, nextProps.tripLocationIds, nextProps.updateTripLocationId)});
    }
  }

  componentDidMount() {
    this.getDirections();
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.fullTripDetails !== this.props.fullTripDetails) || ((prevProps.updateTripLocationId !== this.props.updateTripLocationId))) {
      console.log('map updated!')
      this.getDirections();
    }
  }

  getWaypts = function(fullTripDetails, tripLocationIds, updateTripLocationId) {
    let waypts = [];
    const currentDay = tripLocationIds.findIndex(x => x == updateTripLocationId);
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
            directions: result,
          });
          console.log('reuslt: ', result)
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
    }
  }

  render() {
    const DirectionsGoogleMap = withGoogleMap(props => (
      <GoogleMap
        defaultZoom={7}
        defaultCenter={this.state.center}
      >
        {this.state.directions && <DirectionsRenderer directions={this.state.directions} />}
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
        directions={this.state.directions}
      />
    );
  }
}