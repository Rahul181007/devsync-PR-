import { RequestUser } from "../../shared/types/AuthUser";

declare global{
    namespace Express{
        interface Request{
            user?:RequestUser
        }
    }
}

export{}