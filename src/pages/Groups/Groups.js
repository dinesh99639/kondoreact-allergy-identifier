import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import { parseUserData } from '../../utils/utils';
import './Groups.css';
import Group from './Group';

const Groups = () => {
  const { userDetails } = useContext(UserContext);
  console.log(parseUserData(userDetails));
  const [parsedUserDetails, setParsedUserDetails] = useState({});
  const [openIndex, setOpenIndex] = useState(null);
  useEffect(() => {
    console.log();
    setParsedUserDetails(parseUserData(userDetails));
  }, []);

  useEffect(() => {
    console.log(parsedUserDetails);
  }, [parsedUserDetails]);
  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="ailment-container">
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
        {parsedUserDetails?.groups &&
          parsedUserDetails.groups.map((group) => {
            console.log(group);
            return <Group group={group} />;
          })}
      </div>
    </div>
  );
};

export default Groups;
