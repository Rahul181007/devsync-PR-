import { AcceptInviteInput } from "../../dto/invite/acceptInvite.dto";
import { AcceptInviteResponse } from "../../dto/invite/acceptInviteResponse.dto";

export interface IAcceptInviteUseCase {
  execute(input: AcceptInviteInput): Promise<AcceptInviteResponse>;
}