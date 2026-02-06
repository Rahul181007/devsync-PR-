import { BlockDeveloperContext } from "../../dto/user/blockDeveloperContext.dto";

export interface IBlockDeveloperUseCase {
  execute(
    developerId: string,
    invoker: BlockDeveloperContext
  ): Promise<void>;
}