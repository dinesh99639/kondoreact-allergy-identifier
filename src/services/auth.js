export const getToken = async () => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_AUTH_URL}/oauth/token?grant_type=client_credentials`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(
            process.env.REACT_APP_CLIENT_ID +
              ':' +
              process.env.REACT_APP_CLIENT_SECRET
          )}`,
        },
      }
    );

    const data = await res.json();
    return { success: true, ...data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const registerNewUser = async (
  email,
  firstName,
  lastName,
  password,
  access_token,
  token_type
) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_HOST}/${process.env.REACT_APP_PROJECT_KEY}/me/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token_type} ${access_token}`,
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          password,
          custom: {
            type: {
              key: 'customer-custom-type',
              typeId: 'type',
            },
            fields: {
              ailments: [],
              groups: [],
              scanned: [],
            },
          },
        }),
      }
    );

    const data = await res.json();

    if (data.statusCode === 400) {
      return { success: false, error: data.message };
    }
    return { success: true, ...data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const login = async (email, password) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_AUTH_URL}/oauth/${process.env.REACT_APP_PROJECT_KEY}/customers/token?grant_type=password&username=${email}&password=${password}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(
            process.env.REACT_APP_CLIENT_ID +
              ':' +
              process.env.REACT_APP_CLIENT_SECRET
          )}`,
        },
      }
    );
    const data = await res.json();

    if (data.statusCode === 400) {
      return { success: false, error: data.message };
    }
    return { success: true, ...data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const getUserDetails = async (access_token) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_HOST}/${process.env.REACT_APP_PROJECT_KEY}/me`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
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
