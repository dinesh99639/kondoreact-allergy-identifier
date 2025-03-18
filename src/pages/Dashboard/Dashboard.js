import React, { useEffect, useRef, useState } from 'react';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';

import Ailments from './Ailments';
import './dashboard.css'

const Dashboard = () => {
    const [selected, setSelected] = useState(0);


    const handleSelect = (e) => {
        setSelected(e.selected);
    }
    return (<>
        <TabStrip selected={selected} onSelect={handleSelect} className='tab-container'>
            <TabStripTab title="Ailments">
                <Ailments />
            </TabStripTab>
            <TabStripTab title="Scan Ingridients">
                Add Ingridients component over here
            </TabStripTab>
        </TabStrip>
    </>)
};

export default Dashboard;
