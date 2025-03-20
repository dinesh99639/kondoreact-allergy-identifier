import React, { useContext } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { FaHourglass } from 'react-icons/fa6';
import { Tooltip } from '@progress/kendo-react-tooltip';
import NotFound from '../../components/NotFound/NotFound';
import UserContext from '../../context/UserContext';
import NotificationContext from '../../context/NotificationContext';
import { updateUserData } from '../../services/userdata';
import './ExpiryProducts.css';

const ExpiryProducts = () => {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { showNotification } = useContext(NotificationContext);
  const scannedProducts = userDetails.custom.fields.scanned;
  const sortedProducts = scannedProducts
    .map((sp, idx) => {
      return [
        ...sp,
        idx,
        Math.floor((new Date(sp[2]) - new Date(sp[0])) / (1000 * 60 * 60 * 24)),
      ];
    })
    .sort((a, b) => a[4] - b[4]);

  const deleteItem = async (scannedProductIndex) => {
    const version = userDetails?.version;
    const ailments = userDetails?.custom?.fields?.ailments;
    const groups = userDetails?.custom?.fields?.groups;
    if (version && groups && ailments) {
      scannedProducts.splice(scannedProductIndex, 1);
      const response = await updateUserData(
        version,
        ailments,
        groups,
        scannedProducts
      );
      if (response.success) {
        setUserDetails(response.data);
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
      {sortedProducts.length === 0 && <NotFound />}
      {sortedProducts.length !== 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '80vh',
            width: 'fit-content',
            margin: 'auto',
            overflow: 'hidden auto',
          }}
        >
          {sortedProducts.map((sp, idx) => {
            const backgroundColor =
              sp[4] <= 7
                ? 'red'
                : sp[4] > 7 && sp[4] <= 30
                ? 'orange'
                : 'green';
            return (
              <div
                style={{
                  padding: '1rem',
                  margin: '0.5rem',
                  display: 'flex',
                  width: '20rem',
                  justifyContent: 'space-between',
                  backgroundColor: backgroundColor,
                  boxShadow:
                    'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
                  color: 'white',
                }}
              >
                <div>{sp[1]}</div>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip anchorElement={`target-${idx}`}>
                      <span
                        title={sp[2]}
                        style={{
                          display: 'inline-block',
                        }}
                      >
                        <FaHourglass style={{ cursor: 'pointer' }} />
                      </span>
                    </Tooltip>
                    &nbsp; Expires in {sp[4]} {sp[4] > 1 ? 'Days' : 'Day'}
                  </div>
                  <MdDeleteForever
                    style={{ cursor: 'pointer', fontSize: '1.25rem' }}
                    title="Delete"
                    onClick={() => {
                      deleteItem(idx, sp[3]);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExpiryProducts;
