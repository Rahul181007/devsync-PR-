import { useState } from "react";
import { useAppDispatch } from "../../../store/hook";
import { rejectCompany } from "../store/companies.slice";

interface RejectCompanyModalProps {
    open:boolean;
    companyId:string|null;
    page:number;
    limit:number;
    search?:string;
    status?: "ALL" | "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

    onClose:()=> void
}


const RejectCompanyModal=({
    open,
    companyId,
    page,
    limit,
    search,
    status,
    onClose,
}:RejectCompanyModalProps)=>{
  const dispatch = useAppDispatch();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!open || !companyId) return null;

  const handleSubmit = async () => {
    if (!reason.trim() || reason.trim().length < 5) {
      setError("Rejection reason must be at least 5 characters");
      return;
    }

    setError("");

    await dispatch(
      rejectCompany({
        companyId,
        reason,
        page,
        limit,
        search,
        status,
      })
    );

    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Reject Company
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Please provide a reason for rejecting this company.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
          placeholder="Enter rejection reason..."
        />

        {error && (
          <p className="text-sm text-red-600 mt-2">{error}</p>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectCompanyModal;