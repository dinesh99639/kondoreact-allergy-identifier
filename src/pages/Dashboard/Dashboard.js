import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';

import Ailments from './Ailments';
import ScanIngredients from './ScanIngredients/ScanIngredients';

import './dashboard.css';

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selected, setSelected] = useState(0);

  const handleSelect = (e) => {
    setSelected(e.selected);
    setSearchParams();
  };

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
    </>
  );
};

export default Dashboard;
