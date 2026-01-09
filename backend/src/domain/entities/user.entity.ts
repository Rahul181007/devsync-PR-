export type UserRole='COMPANY_ADMIN'|'DEVELOPER';
export type UserStatus="PENDING_ONBOARDING"|'ACTIVE'|'BLOCKED';

export class User{
    constructor(
        public readonly id:string,
        public companyId:string|null,
        public name:string,
        public email:string,
        public passwordHash:string,
        public role:UserRole,
        public avatarUrl:string| null,
        public status :UserStatus,
        public setting:{
            theme?:string;
            notificationPreferences?:Record<string,boolean>;
        }|null,
        public createdAt:Date,
        public updatedAt:Date,
        public lastLoginAt:Date|null,
    ){}
}