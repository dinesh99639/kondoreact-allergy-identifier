import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import { parseUserData } from '../../utils/utils';

import Group from './Group';
import UpdateGroup from './UpdateGroup';

import './Groups.css';
import { Button } from '@progress/kendo-react-buttons';
const Groups = () => {
  const { userDetails } = useContext(UserContext);
  const [parsedUserDetails, setParsedUserDetails] = useState({});

  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    setParsedUserDetails(parseUserData(userDetails));
  }, []);

  const handleAddGroup = () => {
    setSelectedGroup(null);
    setSelectedId(null);
    setTitle('Add Group');
    setVisible(true);
  };

  const handleUpdateGroup = (id, name) => {
    setSelectedGroup(name);
    setSelectedId(id);
    setTitle('Update Group');
    setVisible(true);
  };

  return (
    <>
      <Button
        onClick={handleAddGroup}
        style={{ marginLeft: '250px', marginTop: '20px' }}
      >
        Add Group
      </Button>
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
            parsedUserDetails.groups
              .filter(
                (group) =>
                  !group.pending.find((user) => user.id === userDetails.id)
              )
              .map((group, idx) => {
                return (
                  <Group
                    group={group}
                    handleUpdateGroup={handleUpdateGroup}
                    key={idx}
                  />
                );
              })}
        </div>
      </div>
      {visible && (
        <UpdateGroup
          visible={visible}
          setVisible={setVisible}
          title={title}
          selectedId={selectedId}
          selectedGroup={selectedGroup}
        />
      )}
    </>
  );
};

export default Groups;
