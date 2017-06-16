// import React, { PropTypes } from 'react';
// import { Link, IndexLink } from 'react-router';
import Auth from '../modules/Auth';
// // import NavigationMenu from 'material-ui/svg-icons/navigation/menu'
import NavigationMenu from 'react-material-icons/icons/navigation/menu';

// import IconMenu from 'material-ui/IconMenu';
// import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

// import Divider from 'material-ui/Divider';
// import Download from 'material-ui/svg-icons/file/file-download';
// import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
// import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
// import Menu from 'material-ui/Menu';


// import AppBar from 'material-ui/AppBar'
// import Drawer from 'material-ui/Drawer'
// import RaisedButton from 'material-ui/RaisedButton'

// toggleDrawer = () => this.setState({ open: !this.state.open })

// const Base = ({ children }) => (
//   <div>
//     <div className="top-bar">
//       <div className="top-bar-left">
//         <IndexLink to="/">Travel with Friends</IndexLink>
//         <IconMenu
//           iconButtonElement={<IconButton><NavigationMenu /></IconButton>}
//           anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
//           targetOrigin={{horizontal: 'left', vertical: 'top'}}
//         >
//           <Menu>
//             <MenuItem
//               primaryText="City Trip"
//               containerElement={<Link to="/" />}
//             />

//             <MenuItem 
//               containerElement={<Link to="/user" />}
//               primaryText="Profile"
//             />

//             <MenuItem
//               containerElement={<Link to="/user" />}
//               primaryText="Explore Around"
//             />

//             <MenuItem
//               primaryText="Trip Mates"
//               onTouchTap={this.handleClose}
//             />

//             <MenuItem
//               primaryText="Split Bills"
//               rightIcon={<ArrowDropRight />}
//               menuItems={[
//                 <MenuItem primaryText="Cut" />,
//                 <MenuItem primaryText="Copy" />,
//                 <Divider />,
//                 <MenuItem primaryText="Paste" />,
//               ]}
//             />
//           </Menu>
//         </IconMenu>
//       </div>

//       {Auth.isUserAuthenticated() ? (
//         <div className="top-bar-right">
//           <Link to="/logout">Log out</Link>
//         </div>
//       ) : (
//         <div className="top-bar-right">
//           <Link to="/login">Log in</Link>
//           <Link to="/signup">Sign up</Link>
//           <Link to="/user">User Detail</Link>
//         </div>
//       )}

//     </div>

//     { /* child component will be rendered here */ }
//     {children}

//   </div>
// );

// Base.propTypes = {
//   children: PropTypes.object.isRequired
// };

// export default Base;




import React, { Component } from 'react'
import { Link } from 'react-router'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'

class Base extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
  }

  toggleDrawer = () => this.setState({ open: !this.state.open })

  render() {
    return (
      <div className="top-bar">
        <IconButton> <NavigationMenu onTouchTap={this.toggleDrawer} /> </IconButton>

        {Auth.isUserAuthenticated() ? (
          <div className="top-bar-right">
            <Link to="/logout">Log out</Link>
            <Link to="/user">User Detail</Link>
          </div>
        ) : (
          <div className="top-bar-right">
            <Link to="/login">Log in</Link>
            <Link to="/signup">Sign up</Link>
          </div>
        )}

        <Drawer
          docked={false}
          width={300}
          onRequestChange={this.toggleDrawer}
          open={this.state.open}
        >
          <AppBar title="Travel with Friends" onLeftIconButtonTouchTap={this.toggleDrawer} />

          <MenuItem
            primaryText="City Trip"
            containerElement={<Link to="/" />}
            onTouchTap={() => {
              this.toggleDrawer()
            }}
          />

          <MenuItem
            primaryText="Exlore Around"
            containerElement={<Link to="/explore" />}
            onTouchTap={() => {
              this.toggleDrawer()
            }}
          />

          <MenuItem
            primaryText="Create Trip"
            containerElement={<Link to="/create" />}
            onTouchTap={() => {
              this.toggleDrawer()
            }}
          />

        </Drawer>

        <div style={{ textAlign: 'center' }}>
          {this.props.children}

        </div>

      </div>
    )
  }
}

export default Base