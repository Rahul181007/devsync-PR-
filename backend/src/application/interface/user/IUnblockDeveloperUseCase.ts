import { BlockDeveloperContext } from "../../dto/user/blockDeveloperContext.dto";

export interface IUnblockDeveloperUseCase {
  execute(
    developerId: string,
    invoker: BlockDeveloperContext
  ): Promise<void>;
}