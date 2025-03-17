import React, { useState } from 'react';
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
  Avatar,
} from '@progress/kendo-react-layout';
import { menuIcon } from '@progress/kendo-svg-icons';
import { Button } from '@progress/kendo-react-buttons';
import Sidebar from './Sidebar';

const Header = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const toggleDrawer = () => {
    setShowDrawer((prev) => !prev);
  };
  const avatarImage =
    'https://demos.telerik.com/kendo-react-ui/assets/dropdowns/contacts/RICSU.jpg';
  return (
    <>
      <AppBar themeColor="primary">
        <AppBarSection>
          <Button
            type="button"
            fillMode="flat"
            svgIcon={menuIcon}
            onClick={toggleDrawer}
          ></Button>
        </AppBarSection>

        <AppBarSpacer style={{ width: 4 }} />

        <AppBarSection>
          <h1 className="title">Ailments Identifer</h1>
        </AppBarSection>

        <AppBarSpacer />

        <AppBarSection style={{ cursor: 'pointer' }}>
          <Avatar type="image">
            <img alt="User" src={avatarImage} />
          </Avatar>
        </AppBarSection>
      </AppBar>
      {showDrawer && <Sidebar />}
    </>
  );
};

export default Header;
