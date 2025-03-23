import React, { useContext, useState } from 'react';
import NotFound from '../../components/NotFound/NotFound';
import UserContext from '../../context/UserContext';
import NotificationContext from '../../context/NotificationContext';
import { updateUserData } from '../../services/userdata';
import './ExpiryProducts.css';
import { parseUserData } from '../../utils/utils';
import ScannedProducts from './ScannedProducts';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';

const ExpiryProducts = () => {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { showNotification } = useContext(NotificationContext);
  const [selected, setSelected] = useState('User Scanned Products');
  const parsedUserData = parseUserData(userDetails);

  const handleSelect = (e) => {
    setSelected(e.selected);
  };

  const sortScannedProducts = (scannedProducts) =>
    scannedProducts
      .map((sp, idx) => {
        const date = new Date(sp[2]);
        const daysToExpiry = isNaN(date.getTime())
          ? Infinity
          : Math.floor((date - new Date()) / (1000 * 60 * 60 * 24));
        return [...sp, idx, daysToExpiry];
      })
      .sort((a, b) => a[4] - b[4]);

  const userScannedProducts = parsedUserData.scanned;
  const sortedUserScannedProducts = sortScannedProducts(userScannedProducts);
  const groupScannedProducts = parsedUserData.groups
    .map((group) => group.scanned)
    .flat();
  const sortedGroupScannedProducts = sortScannedProducts(groupScannedProducts);

  const deleteItem = async (scannedProductIndex) => {
    const version = userDetails?.version;
    const ailments = userDetails?.custom?.fields?.ailments;
    const groups = userDetails?.custom?.fields?.groups;
    if (version && groups && ailments) {
      userScannedProducts.splice(scannedProductIndex, 1);
      const response = await updateUserData(
        version,
        ailments,
        groups,
        userScannedProducts
      );

      if (response.success) {
        setUserDetails((prev) => {
          return {
            ...prev,
            version: response.data.version,
            custom: {
              ...prev.custom,
              fields: {
                ...prev.custom.fields,
                scanned: userScannedProducts,
              },
            },
          };
        });
        showNotification({
          type: 'success',
          message: 'Product removed successfully',
        });
      } else {
        showNotification({
          type: 'error',
          message: 'Error removing product',
        });
      }
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          margin: '1rem',
          gap: '1rem',
          justifyContent: 'center',
        }}
      >
        <p
          style={{
            color: selected === 'User Scanned Products' ? '#4D55CC' : '#000000',
            cursor: 'pointer',
            fontWeight:
              selected === 'User Scanned Products' ? 'bold' : 'normal',
          }}
          onClick={() => setSelected('User Scanned Products')}
        >
          User Scanned Products
        </p>
        <p
          style={{
            color:
              selected === 'Group Scanned Products' ? '#4D55CC' : '#000000',
            cursor: 'pointer',
            fontWeight:
              selected === 'Group Scanned Products' ? 'bold' : 'normal',
          }}
          onClick={() => setSelected('Group Scanned Products')}
        >
          Group Scanned Products
        </p>
      </div>
      {selected === 'User Scanned Products' ? (
        <>
          {sortedUserScannedProducts.length === 0 ? (
            <NotFound message="NO DATA" />
          ) : (
            <ScannedProducts
              scannedProducts={sortedUserScannedProducts}
              scannedByGroup={false}
              deleteItem={deleteItem}
            />
          )}
        </>
      ) : (
        <>
          {sortedGroupScannedProducts.length === 0 ? (
            <NotFound message="NO DATA" />
          ) : (
            <ScannedProducts
              scannedProducts={sortedGroupScannedProducts}
              scannedByGroup={true}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ExpiryProducts;
