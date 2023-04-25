import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

export default function Navbar() {
  const handleAccountClick = () => {
    // Show dropdown or modal with account info
  };
  const handleMenuClick = () => {
    // Show dropdown or modal with menu options
  };
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
        <div className="my-account-tab" onClick={handleAccountClick}>
          <div>
            <FontAwesomeIcon icon={faUser} fontSize={20}/>
          </div>
          <div>
            <a>My Account</a>
          </div>
        </div>
        <div className='navbar-menu' onClick={handleMenuClick}>
          <FontAwesomeIcon icon={faBars} fontSize={20}/>
        </div>
      </div>
    </div>
  );
}