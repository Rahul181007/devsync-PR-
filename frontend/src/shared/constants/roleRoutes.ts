import {ROUTES} from './routes'
import type { AuthRole } from '../../modules/auth/auth.slice'

export const ROLE_ROUTES:Record<AuthRole,{
   login:string;
   dashboard:string
}>={
    SUPER_ADMIN:{
        login:ROUTES.AUTH.SUPER_ADMIN_LOGIN,
        dashboard:ROUTES.SUPER_ADMIN.DASHBOARD
    },
    COMPANY_ADMIN:{
        login:ROUTES.AUTH.COMPANY_LOGIN,
        dashboard:ROUTES.COMPANY_ADMIN.DASHBOARD
    },
    DEVELOPER:{
        login:ROUTES.AUTH.DEVELOPER_LOGIN,
        dashboard:ROUTES.DEVELOPER.DASHBOARD
    }

}