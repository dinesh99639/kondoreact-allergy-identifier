import { getCookie } from '../utils/utils';

export const getUsersByEmail = async (emails) => {
  const access_token = getCookie('access_token');

  if (typeof emails === 'string') {
    emails = [emails];
  }

  return await fetch(
    `${process.env.REACT_APP_HOST}/${
      process.env.REACT_APP_PROJECT_KEY
    }/customers?limit=500&where=email in ("${emails.join('","')}")`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${access_token}` },
    }
  );
};

export const updateUserData = async (version, ailments, groups, scanned) => {
  try {
    const access_token = getCookie('access_token');

    groups = groups.map((group) => ({
      typeId: 'customer-group',
      id: group?.id,
    }));

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

export const updateCustomer = async (user) => {
  let { id, version, ailments, scanned, groups } = user;

  groups = groups.map((group) => ({
    typeId: 'customer-group',
    id: group?.id,
  }));

  try {
    const updatedBody = {
      version: version,
      actions: [
        {
          action: 'setCustomType',
          type: { typeId: 'type', key: 'customer-custom-type' },
          fields: { ailments, scanned, groups },
        },
      ],
    };

    const res = await fetch(
      `${process.env.REACT_APP_HOST}/${process.env.REACT_APP_PROJECT_KEY}/customers/${id}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getCookie('access_token')}`,
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
