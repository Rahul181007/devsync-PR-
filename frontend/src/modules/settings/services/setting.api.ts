import { http } from "../../../core/api/http";
import type { ProfileResponse } from "../types/setting.types";

export const settingsApi = {
    getProfile() {
        return http.get<ProfileResponse>("/settings/profile");
    },

    updateAvatar(data: FormData) {
        return http.patch("/settings/profile/avatar", data)
    },

    updateProfile(data: { name: string }) {
  return http.patch("/settings/profile", data);
},

updateCompanyLogo(data: FormData) {
  return http.patch("/settings/company/logo", data);
},

sendOtp() {
  return http.post("/settings/send-otp");
},

verifyOtp(otp: string) {
  return http.post("/settings/verify-otp", { otp });
},

changePassword(newPassword: string) {
  return http.post("/settings/change-password", {
    newPassword,
  });
},
};