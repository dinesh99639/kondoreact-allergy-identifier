import React, { useContext, useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
} from '@progress/kendo-react-layout';
import { menuIcon } from '@progress/kendo-svg-icons';
import { Button } from '@progress/kendo-react-buttons';
import Sidebar from './Sidebar';
import { Tooltip } from '@progress/kendo-react-tooltip';
import { handleLogout } from '../services/auth';
import { useNavigate } from 'react-router';
import UserContext from '../context/UserContext';

const Header = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const { setUserDetails } = useContext(UserContext);
  const navigate = useNavigate();
  const toggleDrawer = () => {
    setShowDrawer((prev) => !prev);
  };

  return (
    <div style={{ overflow: 'hidden' }}>
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
        <AppBarSpacer />
        <AppBarSection style={{ cursor: 'pointer' }}>
          <Tooltip>
            <span
              title="Logout"
              style={{
                display: 'inline-block',
              }}
            >
              <FiLogOut
                style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                onClick={async () => {
                  const res = await handleLogout();
                  if (res.success) {
                    setUserDetails(null);
                    navigate('/login');
                  }
                }}
              />
            </span>
          </Tooltip>
        </AppBarSection>
      </AppBar>
      <Sidebar expanded={showDrawer} setExpanded={setShowDrawer} />
    </div>
  );
};

export default Header;
