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
import { getUserDetails, handleLogout } from '../services/auth';
import { useNavigate } from 'react-router';
import UserContext from '../context/UserContext';
import { IoMdNotifications } from 'react-icons/io';
import { Popup } from '@progress/kendo-react-popup';
import { getCookie, parseGroups } from '../utils/utils';
import { updateGroup } from '../services/group';
import NotificationContext from '../context/NotificationContext';
import { Typography } from '@progress/kendo-react-common';
import './Header.css';
import { parseUserData } from '../utils/utils';

const Header = (props) => {
  const anchor = useRef(null);
  const [showDrawer, setShowDrawer] = useState(window.innerWidth > 456);
  const [pendingRequests, setPendingRequests] = useState([]);
  const pendingRequestsCount = useRef(0);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [expiredProducts, setExpiredProducts] = useState([]);
  const { setUserDetails, userDetails } = useContext(UserContext);
  const { showNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const groups = parseGroups(userDetails?.custom.fields.groups);
  const parsedUserData = parseUserData(userDetails);

  useEffect(() => {
    setPendingRequests(
      groups.reduce((acc, group) => {
        const hasRequestInCurrentGroup = group?.pending?.find(
          (pendingUser) => pendingUser.id === userDetails.id
        );
        if (hasRequestInCurrentGroup) {
          pendingRequestsCount.current += 1;
          return [
            ...acc,
            { request: hasRequestInCurrentGroup, name: group.name },
          ];
        }
        return acc;
      }, [])
    );
  }, [userDetails]);

  const toggleDrawer = () => {
    setShowDrawer((prev) => !prev);
  };

  const getExpiredProductsDetails = () => {
    const groupScannedProducts = parsedUserData.groups
      .map((group) => group.scanned)
      .flat();
    const expiredProducts = [
      ...userDetails.custom.fields.scanned,
      ...groupScannedProducts,
    ].filter((product) => {
      const remaingDaysToExpire = Math.floor(
        (new Date(product[2]) - new Date()) / (1000 * 60 * 60 * 24)
      );

      if (remaingDaysToExpire <= 0) return product;
    });
    setExpiredProducts(expiredProducts);
  };

  useEffect(() => {
    getExpiredProductsDetails();
  }, [userDetails]);

  const toggleNotificationPanel = () => {
    setShowNotificationPanel((prev) => !prev);
  };

  const handleAcceptInvitation = async (request, groupName) => {
    groups.forEach(async (group) => {
      if (group.name === groupName) {
        pendingRequestsCount.current -= 1;
        group.pending = group.pending.filter(
          (pendingUser) => pendingUser.id !== request.id
        );
        group.accepted.push(request);
        const response = await updateGroup(group);
        if (response.success) {
          const access_token = getCookie('access_token');
          const userDetails = await getUserDetails(access_token);
          if (userDetails.success) {
            setUserDetails(userDetails.data);
            showNotification({
              type: 'success',
              message: `You have accepted the invitation to join ${groupName}`,
            });
          }
        }
      }
    });
  };

  const handleRejectInvitation = (request, groupName) => {
    groups.forEach(async (group) => {
      if (group.name === groupName) {
        pendingRequestsCount.current -= 1;
        group.pending = group.pending.filter(
          (pendingUser) => pendingUser.id !== request.id
        );
        const response = await updateGroup(group);
        if (response.success) {
          setUserDetails(response.data);
          showNotification({
            type: 'success',
            message: `You have rejected the invitation to join ${groupName}`,
          });
        }
      }
    });
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
          <Typography.h6 style={{ fontSize: '20px', margin: 'auto 10px' }}>
            Allergy Identifier
          </Typography.h6>
        </AppBarSection>
        <AppBarSpacer style={{ width: 4 }} />
        <AppBarSpacer />
        <AppBarSection style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Typography.h6 style={{ margin: 'auto 0' }}>
              {userDetails.firstName + ' ' + userDetails.lastName}
            </Typography.h6>
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
                  {expiredProducts.length + pendingRequestsCount.current}
                </span>
              )}
              <Popup
                anchor={anchor.current}
                show={showNotificationPanel}
                style={{
                  width: '300px',
                  paddingRight: '1rem',
                }}
              >
                <div>
                  {expiredProducts.length > 0 && (
                    <div
                      className="card"
                      onClick={() => {
                        navigate('/products-expiry');
                      }}
                    >
                      <div className="card-wrapper">
                        <div className="card-content">
                          <div className="card-title-wrapper">
                            <span className="card-title">Expired Items</span>
                          </div>
                          <div className="product-name">
                            {expiredProducts.length} items are expired
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {pendingRequests.length > 0 &&
                    pendingRequests.map((pr) => {
                      console.log('pr', pr);
                      return (
                        <div className="card">
                          <div className="card-wrapper">
                            <div className="card-content">
                              <div className="card-title-wrapper">
                                <span className="card-title">
                                  Group Invitation
                                </span>
                              </div>
                              <div className="product-name">
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  You are requested to join {pr.name}
                                  <MdCheck
                                    style={{
                                      color: 'green',
                                      fontSize: '1.5rem',
                                      cursor: 'pointer',
                                    }}
                                    onClick={() =>
                                      handleAcceptInvitation(
                                        pr.request,
                                        pr.name
                                      )
                                    }
                                  />
                                  <IoMdClose
                                    style={{
                                      color: 'red',
                                      fontSize: '1.5rem',
                                      cursor: 'pointer',
                                    }}
                                    onClick={() =>
                                      handleRejectInvitation(
                                        pr.request,
                                        pr.name
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {expiredProducts.length + pendingRequestsCount.current ===
                    0 && (
                    <div
                      className="card"
                      onClick={() => {
                        navigate('/products-expiry');
                      }}
                    >
                      <div className="card-wrapper">
                        <div className="card-content">
                          <div className="card-title-wrapper">
                            <span className="card-title">No Notifications</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
