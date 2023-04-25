import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

class Navbar extends Component {

  handleAccountClick = () => {
    // Show dropdown or modal with account info
  };

  handleMenuClick = () => {
    // setState({ isMenuClick: !this.state.isMenuClick });
  };

  render() {
    return (
      <div className="navbar">
        <div className='navbar-heading'>
          <div className='heading-name'>
            <a>Apache Karavan</a>
          </div>
          <div className='heading-div'>
            <a>|</a>
          </div>
          <div className='heading-desc'>
            <a>Your Integration Toolkit</a>
          </div>
        </div>
        <div className='navbar-utils'>
          <div className="my-account-tab" onClick={this.handleAccountClick}>
            <div>
              <FontAwesomeIcon icon={faUser} fontSize={20}/>
            </div>
            <div>
              <a>My Account</a>
            </div>
          </div>
          <div className='navbar-menu' onClick={this.handleMenuClick}>
            <FontAwesomeIcon icon={faBars} fontSize={20}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;
