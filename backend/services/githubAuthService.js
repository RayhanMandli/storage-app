import "dotenv/config";

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;
export const getAccessTokenFromCode = async (code) => {
    try {
        const tokenRes = await fetch(
            "https://github.com/login/oauth/access_token",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client_id,
                    client_secret,
                    code,
                }),
            }
        );
        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;
        return accessToken;
    } catch (err) {
        console.log(err);
    }
};
export const getGithubUserData = async (accessToken) => {
    try {
        const userRes = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
            },
        });

        const ghUser = await userRes.json();
        return ghUser;
    } catch (err) {
        console.log(err);
    }
};
export const getGithubUserEmail = async (accessToken) => {
    const emailsRes = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      }
    });

    const emails = await emailsRes.json();
    return emails
}
