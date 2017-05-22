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



// const FullTripList = ({fullTripDetails}) => {
//     var lis = [];
//     var days = 0;
//     for (var i=0; i<fullTripDetails.length; i++){
//         lis.push(<ListItem
//             value={i}
//             primaryText={fullTripDetails[i].name}
//             secondaryText={
//             <p>
//               {fullTripDetails[i].address}</p>
//             }
//             secondaryTextLines={2}
//             leftAvatar={<Avatar src="https://lh5.googleusercontent.com/proxy/FyVj9FfjSHvC1yxPf2xVBFmXFa1GD3AuzxirbfZwAXL4rltExz5Dv7EVUqZxmr-PMln0KgUYm646mNE3i1or3EXxApQyvTPegsqbVMD75s_ghErqZmcJx9tolXPjb0NRDwEsuzCAD8au2lNwDpwvNugPmUOzvTg=w427-h320-k-no" />}
//           />)
//     }
//   return (
//     <SelectableList defaultValue={3}>
//       <Subheader>San Francisco Day 1 Trip Details</Subheader>
//       {lis}
//     </SelectableList>
//       )
// }


// FullTripList.propTypes = {
//   fullTripDetails: PropTypes.array.isRequired,
// };

// export default FullTripList;

export default class FullTripList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
    };
  }

  handleChange = (value) => {
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
    const rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem>Resuggest</MenuItem>
        <MenuItem>Delete</MenuItem>
      </IconMenu>
    );
    let SelectableList = makeSelectable(List);
    var tabLis = [];
    var fullWrap = [];
    var selectList = [];
    for (var i=0; i<Number(this.props.daysValue); i++) {
        tabLis.push(
            <Tab label={'Day '+(i+1).toString()} value={i} />
        );
        var fullDetails = [];
        
        for (var j=0; j<this.props.fullTripDetails.length; j++) {
            if (this.props.fullTripDetails[j].day == i){
                fullDetails.push(
                    <ListItem 
                        value={j}
                        primaryText={this.props.fullTripDetails[j].name}
                        secondaryText={
                            <p>
                                {this.props.fullTripDetails[j].address}
                            </p>  
                        }
                        secondaryTextLines={2}
                        rightIconButton={rightIconMenu}
                        leftAvatar={<Avatar src="https://lh5.googleusercontent.com/proxy/FyVj9FfjSHvC1yxPf2xVBFmXFa1GD3AuzxirbfZwAXL4rltExz5Dv7EVUqZxmr-PMln0KgUYm646mNE3i1or3EXxApQyvTPegsqbVMD75s_ghErqZmcJx9tolXPjb0NRDwEsuzCAD8au2lNwDpwvNugPmUOzvTg=w427-h320-k-no" />} />
                );
                fullWrap[i] = fullDetails;
            } 
        }
        selectList.push(<div>
                            <SelectableList defaultValue={3}>
                                {fullWrap[i]}
                            </SelectableList>
                        </div>);
    };
    console.log('full wrap', selectList)

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


// let SelectableList = makeSelectable(List);

// 

// 

// const FullTripList = ({fullTripDetails}) => {
//     var lis = [];
//     var days = 0;
//     for (var i=0; i<fullTripDetails.length; i++){
//         lis.push(<ListItem
//             value={i}
//             primaryText={fullTripDetails[i].name}
//             secondaryText={
//             <p>
//               {fullTripDetails[i].address}</p>
//             }
//             secondaryTextLines={2}
//             leftAvatar={<Avatar src="https://lh5.googleusercontent.com/proxy/FyVj9FfjSHvC1yxPf2xVBFmXFa1GD3AuzxirbfZwAXL4rltExz5Dv7EVUqZxmr-PMln0KgUYm646mNE3i1or3EXxApQyvTPegsqbVMD75s_ghErqZmcJx9tolXPjb0NRDwEsuzCAD8au2lNwDpwvNugPmUOzvTg=w427-h320-k-no" />}
//           />)
//     }
//   return (
//     <SelectableList defaultValue={3}>
//       <Subheader>San Francisco Day 1 Trip Details</Subheader>
//       {lis}
//     </SelectableList>
//       )
// }


// FullTripList.propTypes = {
//   fullTripDetails: PropTypes.array.isRequired,
// };

// export default FullTripList;








// const ListExampleMessages = () => (
//   <div>
//     <MobileTearSheet>
//       <List>
//         <Subheader>Today</Subheader>
//         <ListItem
//           leftAvatar={<Avatar src="images/ok-128.jpg" />}
//           primaryText="Brunch this weekend?"
//           secondaryText={
//             <p>
//               <span style={{color: darkBlack}}>Brendan Lim</span> --
//               I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
//             </p>
//           }
//           secondaryTextLines={2}
//         />
//         <Divider inset={true} />
//         <ListItem
//           leftAvatar={<Avatar src="images/kolage-128.jpg" />}
//           primaryText={
//             <p>Summer BBQ&nbsp;&nbsp;<span style={{color: lightBlack}}>4</span></p>
//           }
//           secondaryText={
//             <p>
//               <span style={{color: darkBlack}}>to me, Scott, Jennifer</span> --
//               Wish I could come, but I&apos;m out of town this weekend.
//             </p>
//           }
//           secondaryTextLines={2}
//         />
//         <Divider inset={true} />
//         <ListItem
//           leftAvatar={<Avatar src="images/uxceo-128.jpg" />}
//           primaryText="Oui oui"
//           secondaryText={
//             <p>
//               <span style={{color: darkBlack}}>Grace Ng</span> --
//               Do you have Paris recommendations? Have you ever been?
//             </p>
//           }
//           secondaryTextLines={2}
//         />
//         <Divider inset={true} />
//         <ListItem
//           leftAvatar={<Avatar src="images/kerem-128.jpg" />}
//           primaryText="Birdthday gift"
//           secondaryText={
//             <p>
//               <span style={{color: darkBlack}}>Kerem Suer</span> --
//               Do you have any ideas what we can get Heidi for her birthday? How about a pony?
//             </p>
//           }
//           secondaryTextLines={2}
//         />
//         <Divider inset={true} />
//         <ListItem
//           leftAvatar={<Avatar src="images/raquelromanp-128.jpg" />}
//           primaryText="Recipe to try"
//           secondaryText={
//             <p>
//               <span style={{color: darkBlack}}>Raquel Parrado</span> --
//               We should eat this: grated squash. Corn and tomatillo tacos.
//             </p>
//           }
//           secondaryTextLines={2}
//         />
//       </List>
//     </MobileTearSheet>
//     <MobileTearSheet>
//       <List>
//         <Subheader>Today</Subheader>
//         <ListItem
//           leftAvatar={<Avatar src="images/ok-128.jpg" />}
//           rightIconButton={rightIconMenu}
//           primaryText="Brendan Lim"
//           secondaryText={
//             <p>
//               <span style={{color: darkBlack}}>Brunch this weekend?</span><br />
//               I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
//             </p>
//           }
//           secondaryTextLines={2}
//         />
//         <Divider inset={true} />
//         <ListItem
//           leftAvatar={<Avatar src="images/kolage-128.jpg" />}
//           rightIconButton={rightIconMenu}
//           primaryText="me, Scott, Jennifer"
//           secondaryText={
//             <p>
//               <span style={{color: darkBlack}}>Summer BBQ</span><br />
//               Wish I could come, but I&apos;m out of town this weekend.
//             </p>
//           }
//           secondaryTextLines={2}
//         />
//         <Divider inset={true} />
//         <ListItem
//           leftAvatar={<Avatar src="images/uxceo-128.jpg" />}
//           rightIconButton={rightIconMenu}
//           primaryText="Grace Ng"
//           secondaryText={
//             <p>
//               <span style={{color: darkBlack}}>Oui oui</span><br />
//               Do you have any Paris recs? Have you ever been?
//             </p>
//           }
//           secondaryTextLines={2}
//         />
//         <Divider inset={true} />
//         <ListItem
//           leftAvatar={<Avatar src="images/kerem-128.jpg" />}
//           rightIconButton={rightIconMenu}
//           primaryText="Kerem Suer"
//           secondaryText={
//             <p>
//               <span style={{color: darkBlack}}>Birthday gift</span><br />
//               Do you have any ideas what we can get Heidi for her birthday? How about a pony?
//             </p>
//           }
//           secondaryTextLines={2}
//         />
//         <Divider inset={true} />
//         <ListItem
//           leftAvatar={<Avatar src="images/raquelromanp-128.jpg" />}
//           rightIconButton={rightIconMenu}
//           primaryText="Raquel Parrado"
//           secondaryText={
//             <p>
//               <span style={{color: darkBlack}}>Recipe to try</span><br />
//               We should eat this: grated squash. Corn and tomatillo tacos.
//             </p>
//           }
//           secondaryTextLines={2}
//         />
//       </List>
//     </MobileTearSheet>
//   </div>
// );