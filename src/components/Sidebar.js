import { Drawer } from '@progress/kendo-react-layout';
import React, { useState } from 'react';
import { groupIcon, clockIcon, userIcon } from '@progress/kendo-svg-icons';
import { useNavigate } from 'react-router';

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
