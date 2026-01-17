export type UserRole='COMPANY_ADMIN'|'DEVELOPER';
export type UserStatus='PENDING_VERIFICATION'|"PENDING_ONBOARDING"|'ACTIVE'|'BLOCKED';
export type AuthProvider = "LOCAL" | "GOOGLE";

export class User{
    constructor(
        public readonly id:string,
        public companyId:string|null,
        public name:string,
        public email:string,
        public passwordHash:string|null,
        public role:UserRole,
        public avatarUrl:string| null,
        public status :UserStatus,
        public authProvider:AuthProvider,
        public otp:string|null,
        public otpExpiresAt:Date|null,
        public setting:{
            theme?:string;
            notificationPreferences?:Record<string,unknown>;
        }|null,
        public createdAt:Date,
        public updatedAt:Date,
        public lastLoginAt:Date|null,
    ){}
}