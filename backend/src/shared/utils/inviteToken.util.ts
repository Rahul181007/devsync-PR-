import crypto from 'crypto';

export class InviteTokenUtil{
    static generateToken():string {
        return crypto.randomBytes(32).toString('hex')
    }

    static generateExpiry(hours=24):Date{
        return new Date(Date.now()+hours*60*60*1000)
    }
}