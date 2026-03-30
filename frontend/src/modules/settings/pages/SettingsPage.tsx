import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hook"
import { getProfile } from "../store/setting.slice";
import Spinner from "../../../shared/components/LoadingSpinner";
import ProfileCard from "../components/ProfileCard";
import ChangePassword from "../components/ChangePassword";
import { Shield, User, Lock } from "lucide-react";

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((state) => state.setting);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Profile</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Modern Header with Gradient */}
      <div className="bg-white border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your account preferences and security settings
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {profile.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm sticky top-8">
              <div className="p-6 border-b border-gray-200/80">
                <h3 className="font-semibold text-gray-800">Settings Menu</h3>
                <p className="text-xs text-gray-500 mt-1">Configure your account</p>
              </div>
              <nav className="p-4">
                <a 
                  href="#profile" 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-medium transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                  <span>Profile Information</span>
                </a>
                <a 
                  href="#security" 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200 mt-1"
                >
                  <Shield className="w-5 h-5" />
                  <span>Security</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Main Settings Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Section */}
            <div id="profile">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-1 h-6 bg-linear-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  Profile Information
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update your personal details and profile picture
                </p>
              </div>
              <ProfileCard profile={profile} />
            </div>

            {/* Security Section */}
            <div id="security">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-1 h-6 bg-linear-to-b from-purple-500 to-purple-600 rounded-full"></div>
                  Security
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your password and security settings
                </p>
              </div>
              <ChangePassword />
            </div>

            {/* Additional Info Card */}
            <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Security Tips</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Enable two-factor authentication for an extra layer of security
                  </p>
                  <button className="mt-3 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
                    Learn more →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;