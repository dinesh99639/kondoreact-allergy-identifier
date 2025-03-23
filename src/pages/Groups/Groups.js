import React, { useContext, useEffect, useState } from 'react';

import UserContext from '../../context/UserContext';
import NotificationContext from '../../context/NotificationContext';
import { getCookie, parseUserData } from '../../utils/utils';
import { updateGroup } from '../../services/group';
import { updateUserData } from '../../services/userdata';
import { getUserDetails } from '../../services/auth';

import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';

import Group from './Group';
import UpdateGroup from './UpdateGroup';

import './Groups.css';
import NotFound from '../../components/NotFound/NotFound';

const Groups = () => {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { showNotification } = useContext(NotificationContext);

  const [visible, setVisible] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    group: null,
  });

  const [parsedUserDetails, setParsedUserDetails] = useState({});
  const [title, setTitle] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    setParsedUserDetails(parseUserData(userDetails));
  }, [userDetails]);

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

  const confirmDelete = async () => {
    const user = parseUserData(userDetails);

    user.groups = user.groups.filter((el) => el.id !== deleteDialog.group.id);
    deleteDialog.group.accepted = deleteDialog.group.accepted.filter(
      (el) => el.id !== userDetails.id
    );

    const res = await Promise.all([
      updateGroup(deleteDialog.group),
      updateUserData(user.version, user.ailments, user.groups, user.scanned),
    ]);

    if (res.length) {
      const userDetailsRes = await getUserDetails(getCookie('access_token'));
      if (userDetailsRes.success) {
        setUserDetails(userDetailsRes.data);
        showNotification({
          type: 'success',
          message: 'Group removed Successfully.',
        });

        setDeleteDialog({ isOpen: false, group: null });
      }
    }
  };

  const handleDeleteGroup = async (group) => {
    setDeleteDialog({ isOpen: true, group });
  };

  return (
    <>
      <div className="ailment-container">
        <div style={{ textAlign: 'center', margin: '15px 0' }}>
          <Button onClick={handleAddGroup}>Add Group</Button>
        </div>
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
          {parsedUserDetails?.groups?.length === 0 && (
            <NotFound message="No Groups Found" />
          )}
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
                    handleDeleteGroup={handleDeleteGroup}
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

      {deleteDialog.isOpen && (
        <Dialog
          title={'Please confirm'}
          onClose={() =>
            setDeleteDialog({ isOpen: false, groupName: '', groupId: '' })
          }
        >
          <p style={{ margin: '25px', textAlign: 'center' }}>
            Are you sure you want to exit this <b>{deleteDialog.group.name}</b>{' '}
            group?
          </p>
          <DialogActionsBar>
            <Button type="button" onClick={confirmDelete}>
              Yes
            </Button>
            <Button
              type="button"
              onClick={() =>
                setDeleteDialog({ isOpen: false, groupName: '', groupId: '' })
              }
            >
              No
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </>
  );
};

export default Groups;
