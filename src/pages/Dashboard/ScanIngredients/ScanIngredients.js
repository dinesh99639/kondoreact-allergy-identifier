import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import UserContext from '../../../context/UserContext';
import { extractData } from '../../../utils/generateiveAI';
import { updateUserData } from '../../../services/userdata';
import { deleteGroup, updateGroup } from '../../../services/group';
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
import { TextBox } from '@progress/kendo-react-inputs';
import { DatePicker } from '@progress/kendo-react-dateinputs';

import './ScanIngredients.css';

const ScanIngredients = () => {
  const location = useLocation();

  const userContext = useContext(UserContext);

  const [image, setImage] = useState({ data: '', type: '' });

  const [productName, setProductName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isSaveInProgress, setIsSaveInProgress] = useState(null);

  const [names, setNames] = useState({});

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState();

  const [expansionPanels, setExpansionPanels] = useState({});
  const [identification, setIdentification] = useState({
    isLoading: false,
    data: null,
  });

  const saveProduct = async () => {
    if (!productName || !expiryDate) {
      return;
    }

    setIsSaveInProgress(true);

    const formattedExpiryDate = new Date(expiryDate)
      .toLocaleDateString()
      .split('/')
      .reverse()
      .join('-');

    const scannedItem = [
      new Date().toISOString(),
      productName,
      formattedExpiryDate,
    ];

    const scanned = [...selectedGroup?.scanned, scannedItem];

    if (selectedGroup.id === 'self') {
      const user = { ...userContext.userDetails };

      const res = await updateUserData(
        user?.version,
        user?.custom?.fields?.ailments,
        user?.custom?.fields?.groups.map((group) => ({
          typeId: 'customer-group',
          id: group.id,
        })),
        scanned
      );

      user.version = res?.data?.version;
      user.custom.fields.scanned = scanned;

      userContext.setUserDetails(user);
    } else {
      const updatedGroup = await updateGroup({ ...selectedGroup, scanned });

      const user = { ...userContext.userDetails };
      user.custom.fields.groups.forEach((group) => {
        if (group.id === selectedGroup.id) {
          group.obj = updatedGroup.data;
        }
      });

      userContext.setUserDetails(user);
    }

    setIsSaveInProgress(false);
  };

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
    setIdentification((prev) => ({ ...prev, isLoading: true }));

    const payload = {};
    selectedGroup?.accepted?.forEach((user) => {
      payload[user?.id] = user?.ailments || [];
    });

    const res = await extractData(
      image?.data?.split('base64,')[1],
      image?.type,
      payload
    );

    setIdentification((prev) => ({ ...prev, isLoading: false, data: res }));

    const expansionPanels = {};
    const keys = Object.keys(res);

    let defaultExpansionValue = false;
    if (keys.length === 1) {
      defaultExpansionValue = true;
    }

    keys.forEach((key) => {
      expansionPanels[key] = defaultExpansionValue;
    });

    setExpansionPanels(expansionPanels);
  };

  useEffect(() => {
    setImage({ data: location?.state?.image, type: location?.state?.type });
    window.history.replaceState({}, '');
  }, [location?.state]);

  useEffect(() => {
    deleteGroup("b72d6dbb-ffc0-412b-b401-085a14b5bac2", 1)
    const userDetails = parseUserData(userContext?.userDetails);

    const self = {
      id: 'self',
      name: 'Self',
      scanned: userDetails?.scanned,
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

    setNames({
      [userDetails.id]: `${userDetails.firstName} ${userDetails.lastName}`,
    });
  }, []);

  return (
    <div className="scanIngredients">
      <div className="content">
        <div className="left">
          <div className="image">
            {image.data ? (
              <img src={image?.data} />
            ) : (
              <div className="placeholder"></div>
            )}
          </div>
          {identification.data && isSaveInProgress !== false ? (
            <div className="product">
              <div className="productDetails">
                <TextBox
                  fillMode="Outline"
                  placeholder="Product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
                <DatePicker
                  fillMode="outline"
                  placeholder="Expiry date"
                  format="yyyy-MM-dd"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
              <div className="saveButton">
                <Button
                  themeColor="primary"
                  style={{ width: '90px' }}
                  onClick={saveProduct}
                >
                  {isSaveInProgress && (
                    <Loader size="small" type="pulsing" themeColor="light" />
                  )}{' '}
                  Save
                </Button>
              </div>
            </div>
          ) : (
            isSaveInProgress === false && <div className='saveSuccess'>Product saved successfully.</div>
          )}
        </div>
        {image.type ? (
          <>
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
                            themeColor={
                              details.consumable ? 'success' : 'error'
                            }
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
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
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
          </>
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
    </div>
  );
};

export default ScanIngredients;
