import { useState } from "react";
import { companyService } from "../services/company.service";
import { getErrorMessage } from "../../../shared/utiils/getErrorMessage";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}

const CreateCompanyModal = ({ open, onClose, onCreated }: Props) => {
    const [name, setName] = useState('');
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [adminEmail, setAdminEmail] = useState('');

    if (!open) return null;

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Company name is required');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await companyService.createCompany({
                name,
                domain: domain || undefined,
                adminEmail: adminEmail
            });

            setName('');
            setDomain('');
            setAdminEmail('');
            onCreated();
            onClose();
        } catch(error: unknown) {
            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50">
            {/* Modal container positioned over main content */}
            <div className="absolute left-64 right-0 top-16 bottom-0 flex items-center justify-center p-6">
                {/* Transparent backdrop with ONLY blur effect - NO background color */}
                <div 
                    className="absolute inset-0 backdrop-blur-sm"
                    onClick={() => !loading && onClose()}
                />
                
                {/* Modal Content */}
                <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full z-10 border border-gray-200">
                    {/* Modal Header */}
                    <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Create New Company</h3>
                                    <p className="text-sm text-gray-500 mt-1">Add a new company to the platform</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500"
                                disabled={loading}
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="px-6 py-4">
                        <div className="space-y-4">
                            {/* Company Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter company name"
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error && !name.trim() ? 'border-red-300' : 'border-gray-300'}`}
                                    disabled={loading}
                                />
                                {error && !name.trim() && (
                                    <p className="mt-1 text-sm text-red-600">{error}</p>
                                )}
                            </div>

                            {/* Domain */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Domain (optional)
                                </label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500">
                                        https://
                                    </span>
                                    <input
                                        type="text"
                                        value={domain}
                                        onChange={(e) => setDomain(e.target.value)}
                                        placeholder="example.com"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Admin Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company Admin Email (optional)
                                </label>
                                <input
                                    type="email"
                                    value={adminEmail}
                                    onChange={(e) => setAdminEmail(e.target.value)}
                                    placeholder="admin@company.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={loading}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    If provided, an invitation will be sent to this email address
                                </p>
                            </div>

                            {/* General Error */}
                            {error && name.trim() && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating..." : "Create Company"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCompanyModal;