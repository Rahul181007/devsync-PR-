import { GetCompanySubscriptionDTO } from "../../dto/subscription/getCompanySubscription.dto";
import { GetCompanySubscriptionResponseDTO } from "../../dto/subscription/getCompanySubscriptionResponse.dto";

export interface IGetCompanySubscriptionUseCase{
    execute(
        data:GetCompanySubscriptionDTO
    ):Promise<GetCompanySubscriptionResponseDTO>
}