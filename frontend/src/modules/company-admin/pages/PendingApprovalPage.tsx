import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { useEffect } from "react";
import { getMyCompany } from "../store/company.slice";
import { logout } from "../../auth/auth.slice";

const PendingApprovalPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { company, loading } = useAppSelector((state) => state.company);


  useEffect(() => {
    dispatch(getMyCompany());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/company/login", { replace: true });
  };

  if (loading || !company) {
    return (
      <div className="flex items-center justify-center h-screen">
        Checking approval status...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow rounded p-8 max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-3">
          Your company is under review
        </h2>

        <p className="text-gray-600 mb-6">
          <strong>{company.name}</strong> has been successfully set up.
          <br />
          Our team will review and approve it shortly.
        </p>

        <div className="border rounded p-4 mb-6">
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-medium text-yellow-600">
            Pending Super Admin Approval
          </p>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          You’ll get access to the dashboard once approval is completed.
        </p>

        <button
          onClick={handleLogout}
          className="text-sm text-red-500 underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default PendingApprovalPage;