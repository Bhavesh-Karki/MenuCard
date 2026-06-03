import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import { HistoryIcon, UserIcon } from '../Icons';

function MobileDrawer({ show, onHide, user, onOrderHistory, onLogout }) {
  const username = user?.name || 'User';

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="start"
      className="mobile-drawer"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Hey, {username}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="drawer-user">
          <span className="drawer-avatar">
            <UserIcon />
          </span>
          <div>
            <strong>{username}</strong>
            <span>{user?.isGuest ? 'Guest access' : 'Signed in'}</span>
          </div>
        </div>

        <div className="drawer-actions">
          <Button className="drawer-link" onClick={onOrderHistory}>
            <HistoryIcon />
            Order History
          </Button>
          <Button className="drawer-link danger" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default MobileDrawer;
