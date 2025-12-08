import {OAuth2Client} from "google-auth-library"
import "dotenv/config";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const client = new OAuth2Client({client_id: clientId, client_secret: clientSecret});

export const verifyIdTokenAndLoginWithGoogle = async(idToken)=>{
   const ticket = await client.verifyIdToken({idToken, audience: clientId})
   if (!ticket) {
    return null;
   }
   const payload = ticket.getPayload();
   return payload;
}
