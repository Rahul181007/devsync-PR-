export interface GoogleUserPayload{
    email:string;
    name:string;
    emailVerified:boolean
}

export interface IGoogleAuthService{
    verifyIdToken(idToken:string):Promise<GoogleUserPayload>
}