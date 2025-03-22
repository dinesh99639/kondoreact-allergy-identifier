import { getCookie } from '../utils/utils';

export const updateGroup = async (group) => {
  try {
    const access_token = getCookie('access_token');

    let {
      id,
      version,
      name: groupName,
      scanned,
      pending,
      accepted,
      rejected,
    } = group;

    pending = pending.map((user) => ({ typeId: 'customer', id: user?.id }));
    accepted = accepted.map((user) => ({ typeId: 'customer', id: user?.id }));
    rejected = rejected.map((user) => ({ typeId: 'customer', id: user?.id }));

    const payload = {
      version: version,
      actions: [
        {
          action: 'setCustomType',
          type: {
            key: 'customer-group-custom-type',
            typeId: 'type',
          },
          fields: {
            groupName,
            scanned,
            pending,
            accepted,
            rejected,
          },
        },
      ],
    };

    const res = await fetch(
      `${process.env.REACT_APP_HOST}/${process.env.REACT_APP_PROJECT_KEY}/customer-groups/${id}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${access_token}` },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!data) {
      return { success: false, error: data?.message || '' };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
