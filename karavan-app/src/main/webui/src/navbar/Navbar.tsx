import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

interface Props {
  setShowMenuModal: (showMenuModal: boolean) => void;
  showMenuModal: boolean;
}
class Navbar extends Component<Props> {

  handleAccountClick = () => {
    // Show dropdown or modal with account info
  };

  handleMenuClick = () => {
    this.props.setShowMenuModal(!this.props.showMenuModal);
  };

  render() {
    return (
      <div className="navbar">
        <div className='navbar-heading'>
          <div className='heading-name'>
            <span>Apache Karavan</span>
          </div>
          <div className='heading-div'>
            <span>|</span>
          </div>
          <div className='heading-desc'>
            <span>Your Integration Toolkit</span>
          </div>
        </div>
        <div className='navbar-utils'>
          <div className="my-account-tab" onClick={this.handleAccountClick}>
            <div>
              <FontAwesomeIcon icon={faUser} fontSize={20}/>
            </div>
            <div>
              <span>My Account</span>
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
