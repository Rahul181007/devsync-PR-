import { VerifyInviteResponse } from "../../dto/invite/verifyInviteResponse.dto";

export interface IVerifyInviteUseCase {
  execute(token: string): Promise<VerifyInviteResponse>;
}