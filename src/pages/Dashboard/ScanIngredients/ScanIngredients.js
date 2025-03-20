import { useContext, useState } from 'react';
import { useLocation } from 'react-router';

import UserContext from '../../../context/UserContext';
import { extractData } from '../../../utils/generateiveAI';

import { Button, Chip } from '@progress/kendo-react-buttons';
import { Loader } from '@progress/kendo-react-indicators';

import './ScanIngredients.css';
import {
  ExpansionPanel,
  ExpansionPanelContent,
} from '@progress/kendo-react-layout';
import { Reveal } from '@progress/kendo-react-animation';

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

  console.log(userContext);
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

    setNames({
      [userContext.userDetails
        .id]: `${userContext.userDetails.firstName} ${userContext.userDetails.lastName}`,
    });
    setIdentification((prev) => ({ ...prev, isLoading: false, data }));
    setExpansionPanels(
      Object.keys(data).reduce((key, prev) => ({ ...prev, [key]: false }), {})
    );

    console.log('data', data);
  };

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
            <div className="">
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
                    title={names[key]}
                    subtitle={affectedCount}
                    expanded={expansionPanels[key]}
                    tabIndex={0}
                    onAction={() => handleExpansion(key)}
                  >
                    <Reveal
                      transitionEnterDuration={150}
                      transitionExitDuration={150}
                    >
                      {expansionPanels[key] && (
                        <ExpansionPanelContent>
                          <div
                            style={{ display: 'flex', flexDirection: 'column' }}
                          >
                            <div>
                              {Object.keys(details.ailments).map(
                                (key, index) => (
                                  <Chip
                                    key={index}
                                    text={key}
                                    value={key}
                                    themeColor={
                                      !details.ailments[key]
                                        ? 'success'
                                        : 'error'
                                    }
                                  />
                                )
                              )}
                            </div>
                            <div>{details?.reason}</div>
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
