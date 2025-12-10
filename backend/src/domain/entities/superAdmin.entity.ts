export type SuperAdminStatus='ACTIVE'|'INACTIVE'

export class SuperAdmin{
   constructor(
    public readonly id:string,
    public name:string,
    public email:string,
    public passwordHash:string,
    public role:'SUPER_ADMIN',
    public avatarUrl:string|null,
    public status:SuperAdminStatus,
    public createdAt:Date,
    public updatedAt:Date,
    public lastLoginAt:Date|null,
   ){}
}