import { useState } from "react";
import { useAppDispatch } from "../../../store/hook";
import {
  changePassword,
  sendOtp,
  verifyOtp,
} from "../store/setting.slice";
import { KeyRound, X, Shield, Lock, Mail, CheckCircle2, AlertCircle, Info, Clock } from "lucide-react";

const ChangePassword = () => {
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"OTP" | "PASSWORD">("OTP");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setStep("OTP");
    setOtpError("");
    setPasswordError("");
    dispatch(sendOtp()); // background
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError("Please enter the OTP");
      return;
    }
    
    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    setOtpError("");
    setIsVerifying(true);
    
    try {
      await dispatch(verifyOtp({ otp })).unwrap();
      setStep("PASSWORD");
    } catch  {
      setOtpError("Invalid OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChangePassword = async () => {
    if (!password.trim()) {
      setPasswordError("Please enter a new password");
      return;
    }
    
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordError("");
    setIsChanging(true);
    
    try {
      await dispatch(changePassword({ newPassword: password })).unwrap();
      setOpen(false);
      setOtp("");
      setPassword("");
      setStep("OTP");
    } catch  {
      setPasswordError("Failed to change password. Please try again.");
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <>
      {/* Main Card - Always Visible */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl shadow-md flex-shrink-0">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Password Security</h3>
              <p className="text-sm text-gray-500 mt-1">
                Keep your account secure by regularly updating your password
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Shield className="w-3 h-3" />
                  <span>Strong passwords recommended</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>Update every 90 days</span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleOpen}
            className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-6 py-2.5 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap sm:w-auto w-full"
          >
            <KeyRound className="w-4 h-4" />
            <span>Change Password</span>
          </button>
        </div>

        {/* Security Tips */}
        <div className="mt-6 pt-6 border-t border-gray-200/80">
          <div className="bg-blue-50/50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Security Tips</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center gap-2 text-xs text-blue-700">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    <span>Use at least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-700">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    <span>Include numbers and symbols</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-700">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    <span>Mix uppercase & lowercase letters</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-700">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    <span>Avoid common words or patterns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="relative">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* STEP 1: OTP SCREEN */}
            {step === "OTP" && (
              <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                <div className="text-center space-y-4">
                  {/* Icon */}
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Verify Your Identity
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                      We've sent a verification code to your registered email
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <input
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                          setOtpError("");
                        }}
                        placeholder="Enter 6-digit code"
                        className={`w-full border ${otpError ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} px-4 py-3 rounded-xl text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                        autoFocus
                        maxLength={6}
                      />
                      {otpError && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 justify-center">
                          <AlertCircle className="w-3 h-3" />
                          {otpError}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleVerifyOtp}
                      disabled={isVerifying}
                      className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isVerifying ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          Verify OTP
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setOpen(false);
                        setOtp("");
                        setOtpError("");
                      }}
                      className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PASSWORD SCREEN */}
            {step === "PASSWORD" && (
              <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                <div className="text-center space-y-4">
                  {/* Icon */}
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Set New Password
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                      Choose a strong password for your account
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordError("");
                        }}
                        placeholder="Enter new password"
                        className={`w-full border ${passwordError ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-purple-500'} px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                        autoFocus
                      />
                      {passwordError && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {passwordError}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="text-xs text-gray-400">Password requirements:</span>
                        <span className="text-xs text-gray-400">• Min 6 characters</span>
                        <span className="text-xs text-gray-400">• Strong password recommended</span>
                      </div>
                    </div>

                    <button
                      onClick={handleChangePassword}
                      disabled={isChanging}
                      className="w-full bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isChanging ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Update Password
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setOpen(false)}
                      className="text-sm text-gray-400 hover:text-gray-600 transition-colors w-full"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChangePassword;