import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { getMyCompany, updateBranding } from "../../store/company.slice";
import { ROUTES } from "../../../../shared/constants/routes";
import { useNavigate } from "react-router-dom";

const BrandingPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.company);

  const [logo, setLogo] = useState<File | null>(null);
  const [themeColor, setThemeColor] = useState("#000000");
 
  useEffect(() => {
  dispatch(getMyCompany());
}, [dispatch]);



  const handleSubmit = async () => {
    const res = await dispatch(
      updateBranding({
        logo: logo ?? undefined,
        themeColor,
      })
    );

    if (updateBranding.fulfilled.match(res)) {
      navigate(ROUTES.COMPANY_ADMIN.COMPANY_ONBOARDING_PROJECt, {
        replace: true,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-xl font-semibold mb-4">
        Brand your workspace
      </h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <div className="mb-4">
        <label className="block mb-1">Company Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files?.[0] || null)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Theme Color</label>
        <input
          type="color"
          value={themeColor}
          onChange={(e) => setThemeColor(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-4 py-2 w-full"
      >
        {loading ? "Saving..." : "Save & Continue"}
      </button>
    </div>
  );
};

export default BrandingPage;

