import qs from "querystring";
import { User } from "../models/userModel.js";
import "dotenv/config";

const client_id = process.env.GOOGLE_CLIENT_ID;
const redirect_uri = process.env.GOOGLE_REDIRECT_URI;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;

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
