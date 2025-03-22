import { Drawer } from '@progress/kendo-react-layout';
import React, { useEffect, useState } from 'react';
import { groupIcon, clockIcon, userIcon } from '@progress/kendo-svg-icons';
import { useLocation, useNavigate } from 'react-router';

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

const Sidebar = ({ expanded }) => {
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

  const onSelect = (e) => {
    navigate(e.itemTarget.props.route);
    setSelected(e.itemIndex);
  };

  return (
    <Drawer
      style={{
        zIndex: 1,
        position: 'absolute',
        height: 'calc(100dvh - 48px)',
        overflow: 'hidden',
      }}
      expanded={expanded}
      position={'start'}
      mode={'push'}
      mini={true}
      items={items.map((item, index) => ({
        ...item,
        selected: index === selected,
      }))}
      onSelect={onSelect}
    ></Drawer>
  );
};

export default Sidebar;
