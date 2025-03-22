import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Drawer, DrawerContent } from '@progress/kendo-react-layout';

import { groupIcon, clockIcon, userIcon } from '@progress/kendo-svg-icons';

import './Sidebar.css';

const items = [
  {
    text: 'Dashboard',
    svgIcon: groupIcon,
    selected: true,
    route: '/',
  },
  {
    text: 'Products Expiry',
    svgIcon: clockIcon,
    route: '/products-expiry',
  },
  {
    text: 'Groups',
    route: '/groups',
    svgIcon: userIcon,
  },
];

const Sidebar = ({ children, expanded, setExpanded }) => {
  const [selected, setSelected] = useState(
    items.findIndex((x) => x.selected === true)
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      setSelected(0);
    } else if (location.pathname === '/products-expiry') {
      setSelected(1);
    } else if (location.pathname === '/groups') {
      setSelected(2);
    }
  }, []);

  const handleClick = () => {
    setExpanded((prevState) => !prevState);
  };

  const onSelect = (e) => {
    navigate(e.itemTarget.props.route);
    setSelected(e.itemIndex);
  };

  return (
    <Drawer
      expanded={expanded}
      position="start"
      mode="push"
      mini={true}
      items={items.map((item, index) => ({
        ...item,
        selected: index === selected,
      }))}
      onSelect={onSelect}
      onOverlayClick={handleClick}
    >
      <DrawerContent>{children}</DrawerContent>
    </Drawer>
  );
};

export default Sidebar;
