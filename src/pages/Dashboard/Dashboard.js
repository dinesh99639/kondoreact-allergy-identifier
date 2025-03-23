import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { Dialog } from '@progress/kendo-react-dialogs';

import Ailments from './Ailments';
import ScanIngredients from './ScanIngredients/ScanIngredients';

import constants from '../../data/constants';

import './dashboard.css';

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleSelect = (e) => {
    setSelected(e.selected);
    setSearchParams();
  };

  useEffect(() => {
    if (!localStorage.getItem('disclaimer')) {
      setVisible(true);
      localStorage.setItem('disclaimer', true);
    }
  }, []);

  useEffect(() => {
    if (searchParams.get('tab') === 'scan-ingredients') {
      setSelected(1);
    }
  }, [searchParams]);

  return (
    <>
      <TabStrip
        selected={selected}
        onSelect={handleSelect}
        className="dashboard"
      >
        <TabStripTab title="Ailments">
          <Ailments />
        </TabStripTab>
        <TabStripTab title="Scan Ingredients">
          <ScanIngredients />
        </TabStripTab>
      </TabStrip>
      {visible && (
        <Dialog
          style={{
            width: '300px',
            height: '250px',
            top: 'unset',
            right: '10px',
            left: 'unset',
            bottom: '10px',
            alignItems: 'unset',
            justifyContent: 'unset',
            flexDirection: 'unset',
          }}
          title={<b>{constants.disclaimer}</b>}
          onClose={() => {
            setVisible(false);
          }}
        >
          <div style={{ margin: '25px', textAlign: 'center' }}>
            {constants.disclaimerMessage}
          </div>
        </Dialog>
      )}
    </>
  );
};

export default Dashboard;
