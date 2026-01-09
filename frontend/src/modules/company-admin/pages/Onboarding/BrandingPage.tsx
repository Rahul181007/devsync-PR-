import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { getMyCompany, updateBranding } from "../../store/company.slice";
import { ROUTES } from "../../../../shared/constants/routes";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../../components/OnboardingLayout";
import { PhotoIcon, PaintBrushIcon } from "@heroicons/react/24/outline"; // Changed to PaintBrushIcon

const BrandingPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.company);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState("#3B82F6");

  useEffect(() => {
    dispatch(getMyCompany());
  }, [dispatch]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    const res = await dispatch(
      updateBranding({
        logo: logo ?? undefined,
        themeColor,
      })
    );

    if (updateBranding.fulfilled.match(res)) {
      navigate(ROUTES.COMPANY_ADMIN.COMPANY_ONBOARDING_PROJECT, {
        replace: true,
      });
    }
  };

  return (
    <OnboardingLayout 
      step={2} 
      title="Brand your workspace"
      subtitle="Customize the look and feel of your workspace"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm font-medium">
            {error}
          </p>
        </div>
      )}

      <div className="space-y-8">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Company Logo
          </label>
          <div className="flex items-center space-x-6">
            <div 
              onClick={triggerFileInput}
              className="group cursor-pointer flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
            >
              {logoPreview ? (
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <>
                  <PhotoIcon className="h-10 w-10 text-gray-400 group-hover:text-blue-500 mb-2" />
                  <span className="text-sm text-gray-500 group-hover:text-blue-600">Upload Logo</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</span>
                </>
              )}
            </div>
            
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">
                Upload your company logo. This will appear in emails, notifications, and the dashboard.
              </p>
              <button
                type="button"
                onClick={triggerFileInput}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {logoPreview ? "Change logo" : "Choose file"}
              </button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
          />
        </div>

        {/* Theme Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Theme Color
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PaintBrushIcon className="h-5 w-5 text-gray-400" /> {/* Changed here */}
              </div>
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-20 h-10 cursor-pointer border border-gray-300 rounded-lg"
              />
            </div>
            
            <div className="flex-1">
              <input
                type="text"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="#3B82F6"
              />
              <p className="mt-2 text-sm text-gray-500">
                This color will be used for buttons, links, and other UI elements
              </p>
            </div>
          </div>
          
          {/* Color Preview */}
          <div className="mt-4 grid grid-cols-5 gap-2">
            {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setThemeColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${themeColor === color ? 'border-gray-900' : 'border-gray-200'} transition-all`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving Changes...
            </span>
          ) : (
            "Save & Continue →"
          )}
        </button>
      </div>
    </OnboardingLayout>
  );
};

export default BrandingPage;


