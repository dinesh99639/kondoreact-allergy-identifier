import { getCookie } from '../utils/utils';

export const getUserByEmail = async (email) => {
  const access_token = getCookie('access_token');

  return await fetch(
    `${process.env.REACT_APP_HOST}/${process.env.REACT_APP_PROJECT_KEY}/customers?where=email="${email}"`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${access_token}` },
    }
  );
};

export const updateUserData = async (version, ailments, groups, scanned) => {
  try {
    const access_token = getCookie('access_token');

    const updatedBody = {
      version: version,
      actions: [
        {
          action: 'setCustomType',
          type: {
            key: 'customer-custom-type',
            typeId: 'type',
          },
          fields: {
            ailments: ailments,
            groups: groups,
            scanned: scanned,
          },
        },
      ],
    };

    const res = await fetch(
      `${process.env.REACT_APP_HOST}/${process.env.REACT_APP_PROJECT_KEY}/me`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(updatedBody),
      }
    );
    const data = await res.json();
    if (data.statusCode === 400) {
      return { success: false, error: data.message };
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
