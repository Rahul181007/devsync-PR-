import { useAppDispatch } from "../../../store/hook";
import { updateAvatar, updateCompanyLogo, updateProfile } from "../store/setting.slice";
import type { ProfileResponse } from "../types/setting.types";
import { useRef, useState } from "react";
import { Camera, Edit2, Check, X, Building2, Mail, User, Briefcase } from "lucide-react";

interface Props {
  profile: ProfileResponse;
}

const ProfileCard = ({ profile }: Props) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const companyInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);

  const handleSave = () => {
    if (!name.trim()) return;
    dispatch(updateProfile({ name }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(profile.name);
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    dispatch(updateAvatar(formData));
  };

  const handleCompanyClick = () => {
    companyInputRef.current?.click();
  };

  const handleCompanyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    dispatch(updateCompanyLogo(formData));
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* Avatar and Name Section */}
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div
              className="relative cursor-pointer"
              onClick={handleAvatarClick}
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg">
                <img
                  src={profile.avatarUrl || "/default-avatar.png"}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-black/60 to-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                <div className="flex flex-col items-center gap-1">
                  <Camera className="w-5 h-5 text-white" />
                  <span className="text-[10px] text-white font-medium">Change</span>
                </div>
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Name and Email */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your name"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-800">{profile.name}</h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200/80">
          <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Briefcase className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Account Type</p>
              <p className="text-sm font-semibold text-gray-700 capitalize">
                {profile.role.toLowerCase().replace('_', ' ')}
              </p>
            </div>
          </div>

          {profile.role === "COMPANY_ADMIN" && (
            <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Building2 className="w-4 h-4 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Company Logo</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    {profile.companyLogo ? "Logo uploaded" : "No logo uploaded"}
                  </p>
                  <button
                    onClick={handleCompanyClick}
                    className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                  >
                    {profile.companyLogo ? "Change" : "Upload"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Company Logo Preview (if exists) */}
        {profile.role === "COMPANY_ADMIN" && profile.companyLogo && (
          <div className="mt-4 pt-4 border-t border-gray-200/80">
            <div className="flex items-center gap-4">
              <p className="text-xs text-gray-500">Logo Preview:</p>
              <div
                className="relative cursor-pointer group"
                onClick={handleCompanyClick}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                  <img
                    src={profile.companyLogo}
                    alt="company logo"
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          ref={companyInputRef}
          className="hidden"
          onChange={handleCompanyFileChange}
        />
      </div>
    </div>
  );
};

export default ProfileCard;