import { Role } from "../shared/constants/roleenum";

declare module "socket.io" {
  interface Socket {
    data: {
      user?: {
        id: string;
        companyId: string;
        role: Role;
      };
    };
  }
}