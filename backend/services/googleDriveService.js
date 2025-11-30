import qs from "querystring";
import { User } from "../models/userModel.js";

const client_id =
    "520971006621-jur4rdm3hnpfgi5mfrbm3s2ort7p50so.apps.googleusercontent.com";
const redirect_uri = "http://localhost:4000/integrations/google-drive/callback";
const client_secret = "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";

export async function refreshGoogleDriveToken(user) {
    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify({
            client_id,
            client_secret,
            refresh_token: user.googleDrive.refresh_token,
            grant_type: "refresh_token",
        }),
    });

    const data = await res.json();

    if (data.access_token) {
        await User.updateOne(
            { _id: user._id },
            {
                "googleDrive.access_token": data.access_token,
                "googleDrive.expires_at": Date.now() + data.expires_in * 1000,
            }
        );
    }

    return data.access_token;
}

export async function getValidAccessToken(user) {
  if (!user.googleDrive) throw new Error("Google Drive not connected");

  const now = Date.now();
  if (user.googleDrive.expires_at < now + 30000) {
    return await refreshGoogleDriveToken(user);
  }

  return user.googleDrive.access_token;
}

export const exchangeCodeForTokens = async (code) => {
    try {
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: qs.stringify({
                code,
                client_id,
                client_secret,
                redirect_uri,
                grant_type: "authorization_code",
            }),
        });

        const tokens = await tokenRes.json();
        return tokens;
    } catch (err) {
        console.error(err);
        res.status(500).send("Error exchanging Google OAuth code");
    }
};
