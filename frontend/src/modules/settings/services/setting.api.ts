import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { ProfileResponse } from "../types/setting.types";

export const settingsApi = {
  getProfile() {
    return http.get<ProfileResponse>(API_ROUTES.SETTINGS.PROFILE);
  },

  updateAvatar(data: FormData) {
    return http.patch(API_ROUTES.SETTINGS.UPDATE_AVATAR, data)
  },

  updateProfile(data: { name: string }) {
    return http.patch(API_ROUTES.SETTINGS.UPDATE_PROFILE, data);
  },

  updateCompanyLogo(data: FormData) {
    return http.patch(API_ROUTES.SETTINGS.UPDATE_COMPANY_LOGO, data);
  },

  sendOtp() {
    return http.post(API_ROUTES.SETTINGS.SEND_OTP);
  },

  verifyOtp(otp: string) {
    return http.post(API_ROUTES.SETTINGS.VERIFY_OTP, { otp });
  },

  changePassword(newPassword: string) {
    return http.post(API_ROUTES.SETTINGS.CHANGE_PASSWORD, {
      newPassword,
    });
  },
};