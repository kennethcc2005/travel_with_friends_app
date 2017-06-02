import React, {Component} from 'react';
import { withGoogleMap, GoogleMap, Marker,DirectionsRenderer } from "react-google-maps";
import Helmet from "react-helmet";


export default class DirectionsTrip extends Component {

  constructor(props) {
    super(props);
    this.state = {
      directions: null,
    };
    this.getWaypts = this.getWaypts.bind(this)
  }

  getWaypts() {
    let waypts = [];
    const currentDay = this.props.tripLocationIds.findIndex(x => x == this.props.updateTripLocationId);
    const oriIndex = this.props.fullTripDetails.findIndex(x => x.day == currentDay);
    const dayAry = this.props.fullTripDetails.map(function(a) {return a.day;});
    const destIndex = dayAry.lastIndexOf(currentDay);
    for (i = oriIndex; i < destIndex; i++){
      location = new google.maps.LatLng(this.props.fullTripDetails[destIndex-1].coord_lat, this.props.fullTripDetails[destIndex-1].coord_long)
    }
    const origin = new google.maps.LatLng(this.props.fullTripDetails[oriIndex].coord_lat, this.props.fullTripDetails[oriIndex].coord_long);

  }

  render() {
    console.log(this.props.fullTripDetails[0])
    let waypts = [];
    const currentDay = this.props.tripLocationIds.findIndex(x => x == this.props.updateTripLocationId);
    const oriIndex = this.props.fullTripDetails.findIndex(x => x.day == currentDay);
    const dayAry = this.props.fullTripDetails.map(function(a) {return a.day;});
    const destIndex = dayAry.lastIndexOf(currentDay);
    const destination = new google.maps.LatLng(this.props.fullTripDetails[destIndex].coord_lat, this.props.fullTripDetails[destIndex].coord_long);
    const origin = new google.maps.LatLng(this.props.fullTripDetails[oriIndex].coord_lat, this.props.fullTripDetails[oriIndex].coord_long);
    
    waypts.push({location: 'Golden Gate Bridge', stopover: true});
    waypts.push({location: new google.maps.LatLng(this.props.fullTripDetails[destIndex-1].coord_lat, this.props.fullTripDetails[destIndex-1].coord_long), stopover: true});
    const DirectionsGoogleMap = withGoogleMap(props => (
      <GoogleMap
        defaultZoom={7}
        defaultCenter={this.state.center}
      >
        {this.state.directions && <DirectionsRenderer directions={this.state.directions} />}
      </GoogleMap>
    ));
    
    const DirectionsService = new google.maps.DirectionsService();
    
    if(origin){ 
      DirectionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: waypts,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
    }

    return (
      <DirectionsGoogleMap
        containerElement={
          <div style={{ height: `100%` }} />
        }
        mapElement={
          <div style={{ height: `100%` }} />
        }
        center={origin}
        directions={this.state.directions}
      />
    );
  }
}