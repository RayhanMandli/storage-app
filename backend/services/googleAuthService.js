import {OAuth2Client} from "google-auth-library"
const clientId =
    "520971006621-jur4rdm3hnpfgi5mfrbm3s2ort7p50so.apps.googleusercontent.com";
const clientSecret = "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";

const client = new OAuth2Client({client_id: clientId, client_secret: clientSecret});

export const verifyIdTokenAndLoginWithGoogle = async(idToken)=>{
   const ticket = await client.verifyIdToken({idToken, audience: clientId})
   if (!ticket) {
    return null;
   }
   const payload = ticket.getPayload();
   return payload;
}
