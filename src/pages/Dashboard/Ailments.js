import React, { useEffect, useState, useContext } from 'react';

import NotificationContext from '../../context/NotificationContext';
import UserContext from '../../context/UserContext';
import { updateUserData } from '../../services/userdata';
import { knownAilments } from '../../data/ailments';

import { AutoComplete } from '@progress/kendo-react-dropdowns';
import { Card } from '@progress/kendo-react-layout';
import { Chip, Button } from '@progress/kendo-react-buttons';

import './ailments.css';

const Ailments = () => {
  const [ailments, setAilments] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [saveButtonVisibility, setSaveButtonVisibility] = useState(false);

  const { userDetails, setUserDetails } = useContext(UserContext);
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    const data = userDetails?.custom?.fields?.ailments;
    if (data) {
      const tempdata = [];
      data.forEach((el) => {
        tempdata.push({ class: 'base', name: el.toLocaleLowerCase() });
      });
      setAilments(tempdata);
    }
  }, []);

  useEffect(() => {
    let flag = false;
    if (ailments) {
      ailments.forEach((ailment) => {
        if (ailment.class !== 'base') {
          flag = true;
        }
      });
    }
    setSaveButtonVisibility(flag);
  }, [ailments]);

  const updateUserAilments = async (newAilments) => {
    const version = userDetails?.version;
    const groups = userDetails?.custom?.fields?.groups;
    const scanned = userDetails?.custom.fields.scanned;
    const tempdata = [];
    if (version && groups && scanned) {
      const res = await updateUserData(version, newAilments, groups, scanned);
      if (res.success) {
        res.data.custom.fields.ailments.forEach((el) => {
          tempdata.push({ class: 'base', name: el.toLocaleLowerCase() });
        });
        setAilments(tempdata);

        const user = { ...userDetails };

        user.version = res?.data?.version;
        user.custom.fields.ailments = newAilments;
        
        setUserDetails(user);
        showNotification({
          type: 'success',
          message: 'updated data successfully',
        });
      } else {
        showNotification({ type: 'error', message: res.error });
      }
    }
  };

  const handleChipRemove = (name) => {
    const data = [...ailments];
    let indexToBeRemoved = -1;
    data.forEach((el, idx) => {
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
      data.splice(indexToBeRemoved, 1);
    }
    setAilments(data);
  };

  const handleAddAilment = () => {
    const el = ailments.find(
      (ailment) =>
        ailment.name.toLocaleLowerCase() === inputValue.toLocaleLowerCase()
    );
    if (el) {
      setInputValue('');
      return;
    }
    if (inputValue) {
      setAilments((prev) => [
        ...prev,
        { class: 'success', name: inputValue.toLocaleLowerCase() },
      ]);
    }
    setInputValue('');
    const chipContainer = document.getElementById('chips');

    // to scroll into view
    setTimeout(
      () => (chipContainer.scrollTop = chipContainer.scrollHeight),
      200
    );
  };

  const handleAutocompleteChange = (ev) => {
    setInputValue(ev.value);
  };

  const handleSave = () => {
    let data = [];
    ailments.forEach((ailment) => {
      if (ailment.class !== 'error') {
        data.push(ailment.name);
      }
    });
    updateUserAilments(data);
  };
  return (
    <>
      <div className="ailment-container">
        <AutoComplete
          data={knownAilments}
          style={{
            width: '400px',
            marginBottom: '10px',
          }}
          onChange={handleAutocompleteChange}
          value={inputValue}
          placeholder="eg. asthma"
        />

        <Card id="chips" className="chip-container">
          <div
            style={
              !ailments || ailments.length === 0
                ? { margin: 'auto' }
                : undefined
            }
          >
            {ailments &&
              ailments.map((ailment) => {
                return (
                  <Chip
                    removable={true}
                    key={ailment.name}
                    text={ailment.name}
                    value={ailment.name}
                    size="medium"
                    themeColor={ailment.class}
                    onRemove={() => {
                      handleChipRemove(ailment.name);
                    }}
                  />
                );
              })}
            {(!ailments || ailments.length === 0) && <span>No Data!</span>}
          </div>
        </Card>

        <div className="button-container">
          <Button
            onClick={handleAddAilment}
            themeColor={'primary'}
            disabled={!inputValue}
          >
            Add Ailment
          </Button>

          {saveButtonVisibility && (
            <Button onClick={handleSave} themeColor={'primary'}>
              Update List
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Ailments;
