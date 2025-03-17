import { Drawer } from '@progress/kendo-react-layout';
import React, { useState } from 'react';
import {
  inboxIcon,
  calendarIcon,
  heartIcon,
  linkIcon,
  bellIcon,
  menuIcon,
  groupBoxIcon,
  gri,
} from '@progress/kendo-svg-icons';

const items = [
  {
    text: 'Dashboard',
    svgIcon: inboxIcon,
    selected: true,
    route: '',
  },
  {
    separator: true,
  },
  {
    text: 'Notifications',
    svgIcon: bellIcon,
    route: '/notifications',
  },
  {
    text: 'Calendar',
    svgIcon: calendarIcon,
    route: '/calendar',
  },
  {
    separator: true,
  },
  {
    text: 'Attachments',
    svgIcon: linkIcon,
    route: '/attachments',
  },
  {
    text: 'Favourites',
    svgIcon: heartIcon,
    route: '/favourites',
  },
];

const Sidebar = () => {
  const [selected, setSelected] = useState(
    items.findIndex((x) => x.selected === true)
  );
  return (
    <Drawer
      expanded={true}
      position={'start'}
      mode={'push'}
      mini={true}
      items={items.map((item, index) => ({
        ...item,
        selected: index === selected,
      }))}
    ></Drawer>
  );
};

export default Sidebar;
