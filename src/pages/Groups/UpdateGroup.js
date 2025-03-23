import { useState, useEffect, useContext } from 'react';

import { getUsersByEmail, updateCustomer } from '../../services/userdata';
import { createGroup, updateGroup } from '../../services/group';
import { getUserDetails } from '../../services/auth';
import { getCookie, parseUserData } from '../../utils/utils';
import NotificationContext from '../../context/NotificationContext';
import UserContext from '../../context/UserContext';

import { Dialog } from '@progress/kendo-react-dialogs';
import { Chip, Button } from '@progress/kendo-react-buttons';
import { Card } from '@progress/kendo-react-layout';
import { Error } from '@progress/kendo-react-labels';
import { Input } from '@progress/kendo-react-inputs';

const UpdateGroup = ({
  visible,
  setVisible,
  title,
  selectedId,
  selectedGroup,
}) => {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [user, setUser] = useState({});

  const [data, setData] = useState([]);
  const [groupname, setGroupName] = useState();
  const [saveButtonVisibility, setSaveButtonVisibility] = useState(false);
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState('');

  const { showNotification } = useContext(NotificationContext);
  const { email: currentUserMail, id: currentUserId } = userDetails;

  useEffect(() => {
    setUser(parseUserData(userDetails));
  }, [userDetails]);

  useEffect(() => {
    const user = parseUserData(userDetails);

    const tempData = [];
    if (selectedId) {
      user.groups.forEach((group) => {
        if (group.id === selectedId) {
          group?.accepted.forEach((el) => {
            tempData.push({ class: 'base', name: el.email, obj: el });
          });
        }
      });
      setData(tempData);
    }
  }, [selectedId]);

  useEffect(() => {
    let flag = false;
    if (data) {
      data.forEach((el) => {
        if (el.class !== 'base') {
          flag = true;
        }
      });
    }
    setSaveButtonVisibility(flag);
  }, [data]);

  const handleChipRemove = (name) => {
    const dummyData = [...data];
    let indexToBeRemoved = -1;
    dummyData.forEach((el, idx) => {
      if (el.name === name) {
        if (el.class === 'error') {
          el.class = 'base';
        } else if (el.class === 'success') {
          indexToBeRemoved = idx;
        } else {
          el.class = 'error';
        }
      }
    });
    if (indexToBeRemoved !== -1) {
      dummyData.splice(indexToBeRemoved, 1);
    }
    setData(dummyData);
  };

  const handleInputChange = (ev) => {
    const value = ev.target.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setInputValue(value);
    if (value && !emailRegex.test(value)) {
      setError('Invalid Email Format.');
    } else {
      setError('');
    }
  };

  const handleAddUser = async () => {
    if (inputValue === currentUserMail) {
      showNotification({
        type: 'error',
        message: 'current user will be auto added',
      });
      setInputValue('');
      return;
    }
    const el = data.find(
      (el) => el.name.toLocaleLowerCase() === inputValue.toLocaleLowerCase()
    );
    if (el) {
      setInputValue('');
      return;
    }
    if (selectedId) {
      let flag;
      user.groups.forEach((group) => {
        if (group.id === selectedId) {
          flag = group.pending.find((el) => el.email === inputValue);
        }
      });
      if (!!flag) {
        showNotification({ type: 'error', message: 'request is already sent' });
        setInputValue('');
        return;
      }
    }
    if (inputValue) {
      const res = await (await getUsersByEmail(inputValue)).json();
      if (res?.total === 1) {
        setData((prev) => [
          ...prev,
          {
            class: 'success',
            name: res?.results[0].email,
            id: res?.results[0].id,
            obj: res?.results[0],
          },
        ]);
      } else {
        showNotification({ type: 'error', message: 'user does not exist' });
      }
    }
    setInputValue('');
  };

  const handleSave = async () => {
    let tempData = [];
    const deletedData = [];
    const addedData = [];
    const emails = [];

    data.forEach((el) => {
      if (el.class === 'base') {
        tempData.push(el.name);
      } else if (el.class === 'error') {
        deletedData.push(el.name);
        emails.push(el.obj.email);
      } else {
        tempData.push(el.name);
        addedData.push({ id: el.id });
        emails.push(el.obj.email);
      }
    });

    if (selectedId) {
      const usersResponse = await (await getUsersByEmail(emails)).json();
      let users = {};
      usersResponse.results.map((user) => {
        user = parseUserData(user);
        users[user.id] = user;
      });

      const userUpdateRequests = [];

      data.forEach((user) => {
        if (user.class === 'success') {
          user.obj = users[user.obj.id];
          user.obj.groups.push({ id: selectedId });
          userUpdateRequests.push(user.obj);
        } else if (user.class === 'error') {
          user.obj = users[user.obj.id];
          user.obj.groups = user.obj.groups.filter(
            (group) => group.id !== selectedId
          );
          userUpdateRequests.push(user.obj);
        }
      });

      const res = await Promise.all(
        userUpdateRequests.map((payload) => updateCustomer(payload))
      );

      let tempGrp = [];
      user.groups.forEach((group) => {
        if (group.id === selectedId) {
          tempGrp = group.accepted.filter(
            (member) => !deletedData.includes(member.email)
          );
          group.accepted = tempGrp;
          group.pending = group.pending.concat(addedData);
          updateGroup(group)
            .then(async (res) => {
              if (res.success) {
                const userDetailsRes = await getUserDetails(
                  getCookie('access_token')
                );
                if (userDetailsRes.success) {
                  setUserDetails(userDetailsRes.data);
                  showNotification({
                    type: 'success',
                    message: 'Group updated successfully',
                  });
                  setVisible(false);
                }
              }
            })
            .catch((err) => {
              showNotification({ type: 'error', message: err.message });
            });
        }
      });
    } else {
      createGroup({
        key: Date.now(),
        name: groupname,
        pending: addedData,
        accepted: [{ id: currentUserId }],
      })
        .then((res) => {
          if (res.statusCode === 201) {
            showNotification({
              type: 'success',
              message: 'Group created Successfully',
            });
          }
        })
        .catch((err) => {
          showNotification({
            type: 'error',
            message: err.message || 'Something went wrong',
          });
        });
    }
    setVisible(false);
  };

  return (
    <Dialog
      title={title}
      onClose={() => {
        setVisible(!visible);
      }}
    >
      <div style={{ margin: '25px', textAlign: 'center' }}>
        {!selectedGroup && (
          <Input
            placeholder="Group name"
            onChange={(ev) => {
              setGroupName(ev.target.value);
            }}
            value={groupname}
          />
        )}
        <Card id="chips" className="chip-container">
          <div
            style={!data || data.length === 0 ? { margin: 'auto' } : undefined}
          >
            {data &&
              data.map((el) => {
                return (
                  <Chip
                    removable={true}
                    key={el.name}
                    text={el.name}
                    value={el.name}
                    size="medium"
                    themeColor={el.class}
                    onRemove={() => {
                      handleChipRemove(el.name);
                    }}
                  />
                );
              })}
            {(!data || data.length === 0) && <span>No Members</span>}
          </div>
        </Card>
        <Input
          placeholder="Email Id"
          onChange={handleInputChange}
          value={inputValue}
        />
        <Error style={{ minHeight: '18px', margin: '5px' }}>{error}</Error>
      </div>
      <div className="button-container">
        <Button
          type="button"
          disabled={!inputValue || error}
          onClick={handleAddUser}
        >
          Add
        </Button>
        {saveButtonVisibility && (
          <Button
            type="button"
            disabled={!selectedGroup && !groupname}
            onClick={handleSave}
          >
            Save
          </Button>
        )}
      </div>
    </Dialog>
  );
};

export default UpdateGroup;
