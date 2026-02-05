import { InviteDeveloperContext } from "../../dto/invite/inviteDeveloperContext.dto";
import { InviteDeveloperInput } from "../../dto/invite/InviteDeveloperInput.dto";
import { InviteDeveloperResponse } from "../../dto/invite/inviteDeveloperResponse.dto";

export interface IInviteDeveloperUseCase {
  execute(
    input: InviteDeveloperInput,
    inviter: InviteDeveloperContext
  ): Promise<InviteDeveloperResponse>;
}