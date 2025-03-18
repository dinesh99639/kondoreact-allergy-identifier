export const updateUserData = async (access_token, version, ailments, groups, scanned) => {
    try {
        const updatedBody = {

            "version": version,
            "actions": [
                {
                    "action": "setCustomType",
                    "type": {
                        "key": "customer-custom-type",
                        "typeId": "type"
                    },
                    "fields": {
                        "ailments": ailments,
                        "groups": groups,
                        "scanned": scanned
                    }
                }
            ]
        }
        const res = await fetch(`${process.env.REACT_APP_HOST}/${process.env.REACT_APP_PROJECT_KEY}/me`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify(updatedBody)
            }
        )
        const data = await res.json();
        if (data.statusCode === 400) {
            return { success: false, error: data.message };
        }
        return { success: true, ...data };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
}