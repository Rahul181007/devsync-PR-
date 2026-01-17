import { OAuth2Client } from "google-auth-library";
import { IGoogleAuthService, GoogleUserPayload } from "../../domain/service/google-auth.service";
import { env } from "../../config/env";
export class GoogleAuthService implements IGoogleAuthService {
    private _client: OAuth2Client;
    constructor() {
        this._client = new OAuth2Client(env.GOOGLE_CLIENT_ID)

    }

    async verifyIdToken(idToken: string): Promise<GoogleUserPayload> {
        const ticket = await this._client.verifyIdToken({
            idToken,
            audience: env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload();
        if (!payload) {
            throw new Error("Invalid Google token");
        }
        if (!payload.email) {
            throw new Error("Google token does not contain email");
        }


        return {
            email: payload.email,
            name: payload.name || '',
            emailVerified: payload.email_verified || false
        }
    }
}