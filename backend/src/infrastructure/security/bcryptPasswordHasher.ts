import bcrypt from 'bcrypt';
import { IPasswordHasher } from '../../domain/service/password-hasher';

export class BcryptPasswordHasher implements IPasswordHasher{
    private readonly _saltRounds=10;

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password,this._saltRounds);
    }
    async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password,hash)
    }
}