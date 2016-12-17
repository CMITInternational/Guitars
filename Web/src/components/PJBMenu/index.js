import React from 'react';
import Menu from 'react-burger-menu/lib/menus/stack';
import { Link } from 'react-router';

class PJBMenu extends React.Component<void, void, void> {
  render () {
    return (
      <Menu width={280} isOpen={false} right>
        <Link to="/" className="menu-item">
          <p>Home</p>
        </Link>
      </Menu>
    );
  }
};

export default PJBMenu;
