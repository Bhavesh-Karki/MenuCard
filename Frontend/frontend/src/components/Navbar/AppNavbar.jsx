import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import ProfileMenu from '../Profile/ProfileMenu';
import menuCardLogo from '../../assets/MenuCardLogo.png';
import { MenuIcon } from '../Icons';

function AppNavbar({ user, onMenuClick, onOrderHistory, onLogout, onHome }) {
  return (
    <Navbar className="app-navbar" sticky="top">
      <div className="nav-inner">
        <Button
          className="icon-button mobile-only"
          aria-label="Open menu"
          onClick={onMenuClick}
        >
          <MenuIcon />
        </Button>

        <button
          type="button"
          className="brand-logo desktop-only"
          onClick={onHome}
          aria-label="Home"
        >
          <img src={menuCardLogo} alt="" />
        </button>

        <button type="button" className="brand-button" onClick={onHome}>
          Menu Card
        </button>

        <ProfileMenu
          user={user}
          onOrderHistory={onOrderHistory}
          onLogout={onLogout}
        />
      </div>
    </Navbar>
  );
}

export default AppNavbar;
