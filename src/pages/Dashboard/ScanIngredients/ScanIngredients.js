import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import UserContext from '../../../context/UserContext';
import { extractData } from '../../../utils/generateiveAI';

import { Button, Chip } from '@progress/kendo-react-buttons';
import { Loader } from '@progress/kendo-react-indicators';
import {
  ExpansionPanel,
  ExpansionPanelContent,
} from '@progress/kendo-react-layout';
import { Reveal } from '@progress/kendo-react-animation';
import { Typography } from '@progress/kendo-react-common';

import './ScanIngredients.css';

const ScanIngredients = () => {
  const location = useLocation();

  const userContext = useContext(UserContext);

  const [names, setNames] = useState({});
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

  const identify = async () => {
    const scanned = location.state;

    setIdentification((prev) => ({ ...prev, isLoading: true }));

    // return;

    const data = await extractData(
      scanned.image.split('base64,')[1],
      scanned.type,
      {
        [userContext?.userDetails?.id]:
          userContext?.userDetails?.custom.fields.ailments,
      }
    );

    // const data = {
    //   "cc002bb0-0e7f-4499-9600-e335d64b50bf": {
    //     consumable: true,
    //     ailments: {
    //       asthma: false,
    //       test: true,
    //       testsdf: false,
    //       taaesdfst: true,
    //       texzcsdfst: false,
    //       texzcbst: false,
    //       tesvcvt: true,
    //       tecxvxcvst: true,
    //       txcvxcest: true,
    //     },
    //     reason:
    //       'No ingredients are known asthma triggers. However, those with allergies should exercise caution due to potential cross-contamination.',
    //   },
    // };

    setNames({
      [userContext.userDetails
        .id]: `${userContext.userDetails.firstName} ${userContext.userDetails.lastName}`,
    });
    setIdentification((prev) => ({ ...prev, isLoading: false, data }));

    const expansionPanels = {};
    const keys = Object.keys(data)
    let defaultExpansionValue = false;

    if (keys.length === 1) {
      defaultExpansionValue = true;
    }

    Object.keys(data).forEach((key) => {
      expansionPanels[key] = defaultExpansionValue
    })
    
    setExpansionPanels(expansionPanels);

    console.log('data', data, userContext);
  };

  // useEffect(() => {
  //   const groups = userContext?.userDetails
  // }, [])

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
                          text={details?.consumable ? "Safe" : "Not Safe"}
                          rounded="full"
                          fillMode="outline"
                          size='small'
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
