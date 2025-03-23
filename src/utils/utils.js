export const getCookie = (name) => {
  let cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};

export const deleteCookie = (name) => {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export const parseGroups = (groups) => {
  if (!groups) return [];

  return (
    groups?.map((data) => {
      const group = data.obj;

      if (!group) return { id: data.id };

      return {
        id: group?.id,
        key: group?.name,
        version: group?.version,
        name: group?.custom?.fields?.groupName,

        scanned: group?.custom?.fields?.scanned,
        pending: group?.custom?.fields?.pending.map((user) =>
          parseUserData(user.obj)
        ),
        accepted: group?.custom?.fields?.accepted.map((user) =>
          parseUserData(user.obj)
        ),
        rejected: group?.custom?.fields?.rejected.map((user) =>
          parseUserData(user.obj)
        ),
      };
    }) || []
  );
};

export const parseUserData = (user) => {
  if (!user) return undefined;

  return {
    id: user?.id,
    version: user?.version,
    email: user?.email,
    firstName: user?.firstName,
    lastName: user?.lastName,

    ailments: user?.custom?.fields?.ailments,
    groups: parseGroups(user?.custom?.fields?.groups),
    scanned: user?.custom?.fields?.scanned
  };
};
