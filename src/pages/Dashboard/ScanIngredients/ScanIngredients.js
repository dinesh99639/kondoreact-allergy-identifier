import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import UserContext from '../../../context/UserContext';
import { extractData } from '../../../utils/generateiveAI';
import { parseUserData } from '../../../utils/utils';

import { Button, Chip } from '@progress/kendo-react-buttons';
import { Loader } from '@progress/kendo-react-indicators';
import {
  ExpansionPanel,
  ExpansionPanelContent,
} from '@progress/kendo-react-layout';
import { Reveal } from '@progress/kendo-react-animation';
import { Typography } from '@progress/kendo-react-common';
import { DropDownList } from '@progress/kendo-react-dropdowns';

import './ScanIngredients.css';

const ScanIngredients = () => {
  const location = useLocation();

  const userContext = useContext(UserContext);

  const [names, setNames] = useState({});

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState();

  const [expansionPanels, setExpansionPanels] = useState({});
  const [identification, setIdentification] = useState({
    isLoading: false,
    data: null,
  });

  const handleExpansion = (id) => {
    setExpansionPanels((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectedGroupChange = ({ value: group }) => {
    setSelectedGroup(group);

    const names = {};
    group?.accepted?.forEach((user) => {
      names[user?.id] = `${user?.firstName} ${user?.lastName}`;
    });

    setNames(names);
  };

  const identify = async () => {
    const scanned = location.state;

    setIdentification((prev) => ({ ...prev, isLoading: true }));

    const payload = {};
    selectedGroup?.accepted?.forEach((user) => {
      payload[user?.id] = user?.ailments || [];
    });

    const res = await extractData(
      scanned.image.split('base64,')[1],
      scanned.type,
      payload
    );

    setIdentification((prev) => ({ ...prev, isLoading: false, data: res }));

    const expansionPanels = {};
    const keys = Object.keys(res);
    let defaultExpansionValue = false;

    if (keys.length === 1) {
      defaultExpansionValue = true;
    }

    Object.keys(res).forEach((key) => {
      expansionPanels[key] = defaultExpansionValue;
    });

    setExpansionPanels(expansionPanels);
  };

  useEffect(() => {
    const userDetails = parseUserData(userContext?.userDetails);

    const self = {
      id: 'self',
      name: 'Self',
      accepted: [
        {
          id: userDetails?.id,
          version: userDetails?.version,

          email: userDetails?.email,
          firstName: userDetails?.firstName,
          lastName: userDetails?.lastName,

          ailments: userDetails?.ailments,
        },
      ],
    };

    const groups = [self, ...userDetails?.groups] || [self];

    setGroups(groups);
    setSelectedGroup(self);

    console.log('parseUserData', userDetails, groups);
  }, []);

  return (
    <div className="scanIngredients">
      {location.state?.image ? (
        <div className="content">
          <div className="image">
            <img src={location.state.image} />
          </div>
          {!identification.data ? (
            <div className="details">
              <div className="helpText">
                Click the below button to identify potential allergens and
                diseases that affects your health.
              </div>
              <div className="groupsDropdown">
                <DropDownList
                  className="dropdown"
                  dataItemKey="id"
                  textField="name"
                  data={groups}
                  value={selectedGroup}
                  onChange={handleSelectedGroupChange}
                />
              </div>
              <div className="identifyButton">
                <Button
                  themeColor="primary"
                  style={{ width: '90px' }}
                  onClick={identify}
                >
                  {identification.isLoading && (
                    <Loader size="small" type="pulsing" themeColor="light" />
                  )}{' '}
                  Identify
                </Button>
              </div>
            </div>
          ) : (
            <div className="scannedUsers">
              {Object.keys(identification.data || {}).map((key, index) => {
                const details = identification.data[key];

                let affectedCount = 0;
                Object.keys(details?.ailments).forEach((key) => {
                  if (details.ailments[key]) {
                    affectedCount++;
                  }
                });

                return (
                  <ExpansionPanel
                    key={index}
                    title={
                      <>
                        {names[key]}{' '}
                        <Chip
                          text={details?.consumable ? 'Safe' : 'Not Safe'}
                          rounded="full"
                          fillMode="outline"
                          size="small"
                          themeColor={details.consumable ? 'success' : 'error'}
                        />
                      </>
                    }
                    subtitle={affectedCount}
                    expanded={expansionPanels[key]}
                    tabIndex={0}
                    onAction={() => handleExpansion(key)}
                    className={details?.consumable ? 'safe' : 'notSafe'}
                  >
                    <Reveal
                      transitionEnterDuration={150}
                      transitionExitDuration={150}
                    >
                      {expansionPanels[key] && (
                        <ExpansionPanelContent>
                          <div
                            className="panelContent"
                            style={{ display: 'flex', flexDirection: 'column' }}
                          >
                            <div>
                              <Typography.h6>
                                Allergens and Diseases
                              </Typography.h6>
                              <div>
                                {Object.keys(details.ailments).map(
                                  (key, index) => (
                                    <Chip
                                      key={index}
                                      text={key}
                                      value={key}
                                      rounded="full"
                                      fillMode="outline"
                                      themeColor={
                                        !details.ailments[key]
                                          ? 'success'
                                          : 'error'
                                      }
                                    />
                                  )
                                )}
                              </div>
                            </div>
                            <div>
                              <Typography.h6>Reason</Typography.h6>
                              <div>{details?.reason}</div>
                            </div>
                          </div>
                        </ExpansionPanelContent>
                      )}
                    </Reveal>
                  </ExpansionPanel>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div
          className="no-content"
          style={{ width: '100%', textAlign: 'center' }}
        >
          Please capture an image or upload image by clicking on button at
          bottom right corner of the screen to initiate scanning
        </div>
      )}
    </div>
  );
};

export default ScanIngredients;
