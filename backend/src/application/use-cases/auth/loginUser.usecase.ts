import { IUserRepository } from '../../../domain/repositories/user.repository'
import { LoginDTO } from '../../dto/auth/login.dto'
import { LoginResponseDTO } from '../../dto/auth/login.response.dto'
import { Tokenutilits } from '../../../shared/utils/token.util';
import { IPasswordHasher } from '../../../domain/service/password-hasher';
import { AppError } from '../../../shared/errors/AppError';
import { RESPONSE_MESSAGES } from '../../../shared/constants/responseMessages';
import { HttpStatus } from '../../../shared/constants/httpStatus';
import { ICompanyRepository } from '../../../domain/repositories/company.repository';

export class LoginUserUseCase {
  constructor(
    private userRepo: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private companyRepo: ICompanyRepository
  ) {}

  async execute(data: LoginDTO): Promise<LoginResponseDTO> {

    const user = await this.userRepo.findByEmail(data.email);
    if (!user) {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED
      );
    }

    const isValid = await this.passwordHasher.compare(
      data.password,
      user.passwordHash
    );
    if (!isValid) {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED
      );
    }

    if (user.role !== 'COMPANY_ADMIN' && user.role !== 'DEVELOPER') {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH.INVALID_ROLE,
        HttpStatus.FORBIDDEN
      );
    }

    if (user.status === 'BLOCKED') {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH.USER_BLOCKED,
        HttpStatus.FORBIDDEN
      );
    }

  
    if (!user.companyId) {
      const accessToken = Tokenutilits.generateAccessToken({
        sub: user.id,
        role: user.role,
        companyId: null,
        onboarding: true
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId:null,
        requiresOnboarding: true,
        onboardingStep: 'WORKSPACE',
        accessToken
      };
    }


    const company = await this.companyRepo.findById(user.companyId);
    if (!company) {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH.COMPANY_NOT_FOUND,
        HttpStatus.FORBIDDEN
      );
    }


    if (company.onboardingStep !== 'DONE') {
      const accessToken = Tokenutilits.generateAccessToken({
        sub: user.id,
        role: user.role,
        companyId: user.companyId,
        onboarding: true
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId:user.companyId,
        requiresOnboarding: true,
        onboardingStep: company.onboardingStep,
        accessToken
      };
    }


    if (company.status !== 'APPROVED') {
      const accessToken = Tokenutilits.generateAccessToken({
        sub: user.id,
        role: user.role,
        companyId: user.companyId,
        onboarding: false
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId:user.companyId,
        waitingForApproval: true,
        onboardingStep: 'DONE',
        accessToken
      };
    }


    await this.userRepo.updateLastLogin(user.id, new Date());

    const payload = {
      sub: user.id,
      role: user.role,
      companyId: user.companyId
    };

    const accessToken = Tokenutilits.generateAccessToken(payload);
    const refreshToken = Tokenutilits.generateRefreshToken({
      sub: user.id,
      role: user.role
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId:user.companyId,
      onboardingStep: 'DONE',
      accessToken,
      refreshToken
    };
  }
}
