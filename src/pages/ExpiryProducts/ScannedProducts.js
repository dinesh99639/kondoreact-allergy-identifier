import React from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { FaHourglass } from 'react-icons/fa6';
import { Tooltip } from '@progress/kendo-react-tooltip';

const ScannedProducts = ({ scannedProducts, scannedByGroup, deleteItem }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 'fit-content',
        maxHeight: '60vh',
        margin: 'auto',
        overflow: 'hidden auto',
      }}
    >
      {scannedProducts.map((sp, idx) => {
        const backgroundColor =
          sp[4] <= 7 ? 'red' : sp[4] > 7 && sp[4] <= 30 ? 'orange' : 'green';
        return (
          <div
            style={{
              padding: '1rem',
              margin: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: "wrap",
              backgroundColor: backgroundColor,
              boxShadow:
                'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
              color: 'white',
            }}
            className='product-row'
            key={idx}
          >
            <div>{sp[1]}</div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="expired-hourglass-icon">
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
                  &nbsp;{' '}
                </div>
                {sp[4] > 0 ? (
                  <>
                    Expires in {sp[4]} {sp[4] > 1 ? 'Days' : 'Day'}
                  </>
                ) : (
                  <>
                    Expired {Math.abs(sp[4])}{' '}
                    {Math.abs(sp[4]) > 1 ? 'Days' : 'Day'} ago
                  </>
                )}
              </div>
              {!scannedByGroup && (
                <MdDeleteForever
                  style={{ cursor: 'pointer', fontSize: '1.25rem' }}
                  title="Delete"
                  onClick={() => {
                    deleteItem(idx, sp[3]);
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScannedProducts;
