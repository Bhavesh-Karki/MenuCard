import Dropdown from 'react-bootstrap/Dropdown';
import { HistoryIcon, UserIcon } from '../Icons';

function ProfileMenu({ user, onOrderHistory, onLogout }) {
  const username = user?.name || 'User';

  return (
    <Dropdown align="end" className="profile-dropdown">
      <Dropdown.Toggle className="profile-toggle" id="profile-menu">
        <span className="profile-avatar">
          <UserIcon />
        </span>
        <span>Hey, {username}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu className="premium-menu">
        <Dropdown.Header>{username}</Dropdown.Header>
        <Dropdown.Item onClick={onOrderHistory}>
          <HistoryIcon />
          Order History
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ProfileMenu;
