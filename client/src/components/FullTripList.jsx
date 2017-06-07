import React, {Component,PropTypes} from 'react';
// import MobileTearSheet from '../../../MobileTearSheet';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';

export default class FullTripList extends React.Component {
  constructor(props) {
    super(props);
    this.props.getTapName(this.props.tripLocationIds[0])
    this.state = {
      slideIndex: 0,
    };
  }

  handleChange = (value) => {
    this.props.getTapName(this.props.tripLocationIds[value]);
    this.setState({
      slideIndex: value,
    });
  }

  render() {
    const iconButtonElement = (
      <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left"
      >
        <MoreVertIcon color={grey400} />
      </IconButton>
    );
    const rightIconMenu =(poiId,tripLocationId) => {
        return (
          <IconMenu iconButtonElement={iconButtonElement}>
            <MenuItem onClick={() => this.props.onSuggestEvent(poiId, tripLocationId)}>Resuggest</MenuItem>
            <MenuItem onClick={() => this.props.onDeleteEvent(poiId, tripLocationId)}>Delete</MenuItem>
          </IconMenu>
        )
    };
    let SelectableList = makeSelectable(List);
    var tabLis = [];
    var fullWrap = [];
    var selectList = [];
    var maxDays = Math.max.apply(Math, this.props.fullTripDetails.map(function(trip){ return trip.day; }));
    
    for (var i=0; i<maxDays+1; i++) {
        tabLis.push(
            <Tab 
                key={this.props.tripLocationIds[i]}
                label={'Day '+(i+1).toString()} 
                value={i} />
        );
        var fullDetails = [];
        
        for (var j=0; j<this.props.fullTripDetails.length; j++) {
            if (this.props.fullTripDetails[j].day == i){
                let id =  this.props.fullTripDetails[j].id; 
                let keyId = '';
                let primaryTextName = '';
                let secondaryTextaddress = '';
                let avatarUrl = '';
                if (this.props.updateSuggestEvent.hasOwnProperty(id)) {
                  keyId = this.props.updateSuggestEvent[id].id;
                  primaryTextName = this.props.updateSuggestEvent[id].name;
                  secondaryTextaddress = this.props.updateSuggestEvent[id].address;
                  // needs to update new img url:
                  avatarUrl = this.props.fullTripDetails[j].url
                } else {
                  keyId = this.props.fullTripDetails[j].id;
                  primaryTextName = this.props.fullTripDetails[j].name;
                  secondaryTextaddress = this.props.fullTripDetails[j].address;
                  avatarUrl = this.props.fullTripDetails[j].url
                }
                fullDetails.push(
                    <ListItem
                        key={keyId} 
                        value={j}
                        primaryText={primaryTextName}
                        secondaryText={
                            <p>
                                {secondaryTextaddress}
                            </p>  
                        }
                        secondaryTextLines={2}
                        rightIconButton={rightIconMenu(this.props.fullTripDetails[j].id, this.props.tripLocationIds[i])}
                        leftAvatar={<Avatar src={avatarUrl} />} />
                );
                fullWrap[i] = fullDetails;
            } 
        }
        selectList.push(<div key={i}>
                            <SelectableList defaultValue={3}>
                                {fullWrap[i]}
                            </SelectableList>
                        </div>);
    };
    return (
      <div>
        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
        >
          {tabLis}
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          {selectList}
        </SwipeableViews>
      </div>
    );
  }
}

