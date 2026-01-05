export interface LoginResponseDTO{
    id:string;
    name:string;
    email:string;
    role:string;
    accessToken?:string;
    refreshToken?:string;

    requiresOnboarding?:boolean;
    waitingForApproval?:boolean;

}