import React, { useContext } from 'react';
import NotFound from '../../components/NotFound/NotFound';
import UserContext from '../../context/UserContext';
import NotificationContext from '../../context/NotificationContext';
import { updateUserData } from '../../services/userdata';
import './ExpiryProducts.css';
import { parseUserData } from '../../utils/utils';
import ScannedProducts from './ScannedProducts';

const ExpiryProducts = () => {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { showNotification } = useContext(NotificationContext);
  const parsedUserData = parseUserData(userDetails);

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
    <div className="expiry-products-container">
      {sortedUserScannedProducts.length === 0 &&
        sortedGroupScannedProducts.length === 0 && <NotFound />}
      {}
      <div>
        {sortedUserScannedProducts.length > 0 && (
          <>
            <h3>User Scanned Products</h3>
            <ScannedProducts
              scannedProducts={sortedUserScannedProducts}
              scannedByGroup={false}
              deleteItem={deleteItem}
            />
          </>
        )}
        {sortedGroupScannedProducts.length > 0 && (
          <>
            <h3>Group Scanned Products</h3>
            <ScannedProducts
              scannedProducts={sortedGroupScannedProducts}
              scannedByGroup={true}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ExpiryProducts;
