import { AuthProvider, User, UserRole } from "../entities/user.entity";
import { UserStatus } from "../entities/user.entity";

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;

    create(data: {
        companyId?: string | null;
        name: string;
        email: string;
        passwordHash?: string | null;
        role: UserRole;
        authProvider: AuthProvider;
        avatarUrl?: string | null;
        status: UserStatus;
        otp?: string | null;
        otpExpiresAt?: Date | null;
        settings?: {
            theme?: string;
            notificationPreferences?: Record<string, unknown>;
        };
    }): Promise<User>;

    findById(id: string): Promise<User | null>;

    assignCompany(userId: string, companyId: string): Promise<void>;

    updatePassword(userId: string, passwordHash: string): Promise<void>;

    updateLastLogin(userId: string, date: Date): Promise<void>;

    updateStatus(
        userId: string,
        status: UserStatus
    ): Promise<void>

    findDevelopersByCompany(companyId: string, options: {
        page: number;
        limit: number;
        search?: string;
        status?: UserStatus
    }): Promise<{ items: User[]; total: number }>

    updateOtp(
  userId: string,
  otp: string | null,
  otpExpiresAt: Date | null
): Promise<void>;
}