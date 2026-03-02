export interface ILLMService {
  generateProjectSummary(prompt: string): Promise<string>;
}