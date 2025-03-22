import React, { useContext, useEffect, useRef, useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { MdCheck } from 'react-icons/md';
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
import { IoMdNotifications } from 'react-icons/io';
import { Popup } from '@progress/kendo-react-popup';
import { Typography } from '@progress/kendo-react-common';

const Header = (props) => {
  const anchor = useRef(null);
  const [showDrawer, setShowDrawer] = useState(window.innerWidth > 456);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [expiredProducts, setExpiredProducts] = useState([]);
  const { setUserDetails, userDetails } = useContext(UserContext);
  const navigate = useNavigate();
  const groups = userDetails?.custom.fields.groups;
  const pendingRequests = groups.reduce((groups, currentValue) => {
    if (currentValue.obj.custom.fields.pending.length > 0) {
      return [
        ...groups,
        {
          pendingGroups: currentValue.obj.custom.fields.pending,
          groupName: currentValue.obj.custom.fields.groupName,
        },
      ];
    }
    return groups;
  }, []);

  console.log(pendingRequests, 'pendingRequests');

  const toggleDrawer = () => {
    setShowDrawer((prev) => !prev);
  };

  const getExpiredProductsDetails = () => {
    const expiredProducts = userDetails.custom.fields.scanned.filter(
      (product) => {
        const remaingDaysToExpire = Math.floor(
          (new Date(product[2]) - new Date()) / (1000 * 60 * 60 * 24)
        );

        if (remaingDaysToExpire <= 0) return product;
      }
    );
    setExpiredProducts(expiredProducts);
  };

  useEffect(() => {
    getExpiredProductsDetails();
  }, [userDetails]);

  const toggleNotificationPanel = () => {
    setShowNotificationPanel((prev) => !prev);
  };

  const handleAcceptInvitation = () => {};

  const handleRejectInvitation = () => {};

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
          <Typography.h6 style={{ fontSize: "18px", margin: "auto 10px" }}>Allergy Identifier</Typography.h6>
        </AppBarSection>
        <AppBarSpacer style={{ width: 4 }} />
        <AppBarSpacer />
        <AppBarSection style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <IoMdNotifications
                style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                onClick={toggleNotificationPanel}
                ref={anchor}
              />
              {expiredProducts.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '3px 6px',
                    fontSize: '0.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  {expiredProducts.length}
                </span>
              )}
              <Popup
                anchor={anchor.current}
                show={showNotificationPanel}
                style={{ width: '250px', marginRight: '2rem' }}
              >
                <div>
                  {expiredProducts.length > 0 && (
                    <div
                      style={{ padding: '0.5rem', cursor: 'pointer' }}
                      onClick={() => {
                        navigate('/products-expiry');
                      }}
                    >
                      <span>
                        {expiredProducts.length} Items are about to expire
                      </span>
                    </div>
                  )}
                  {pendingRequests.length > 0 &&
                    pendingRequests.map((pr) =>
                      pr.pendingGroups.map((pendingGroup) => {
                        console.log(pr, 'pr');
                        return (
                          <div style={{ padding: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                              {pendingGroup.obj.firstName}{' '}
                              {pendingGroup.obj.lastName} has requested to join{' '}
                              {pr.groupName}
                              <MdCheck
                                style={{
                                  color: 'green',
                                  fontSize: '1.5rem',
                                }}
                                onClick={() => handleAcceptInvitation()}
                              />
                              <IoMdClose
                                style={{
                                  color: 'red',
                                  fontSize: '1.5rem',
                                }}
                                onClick={() => handleRejectInvitation()}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                </div>
              </Popup>
            </div>
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
          </div>
        </AppBarSection>
      </AppBar>
      <Sidebar expanded={showDrawer} setExpanded={setShowDrawer}>
        {props.children}
      </Sidebar>
    </div>
  );
};

export default Header;
