import {ROUTES} from './routes'

type UserRole = "COMPANY_ADMIN" | "DEVELOPER";


export const USER_ROLE_ROUTES: Record<
  UserRole,
  {
    dashboard: (slug: string) => string;
  }
> = {
  COMPANY_ADMIN: {
    dashboard: ROUTES.COMPANY_ADMIN.DASHBOARD,
  },
  DEVELOPER: {
    dashboard: ROUTES.DEVELOPER.DASHBOARD,
  },
};