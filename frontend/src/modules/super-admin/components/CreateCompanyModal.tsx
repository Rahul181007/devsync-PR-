import { useState } from "react";
import { companyService } from "../services/company.service";

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
                domain: domain || undefined
            });

            setName('');
            setDomain('');
            onCreated();
            onClose();
        } catch {
            setError('Failed to create company. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Create New Company</h3>
                        <p className="mt-1 text-sm text-gray-500">Add a new company to the platform</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <div className="p-6">
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
                                />
                            </div>
                        </div>

                        {/* General Error */}
                        {error && name.trim() && (
                            <div className="p-3 bg-red-50 rounded-lg">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Creating...
                            </span>
                        ) : 'Create Company'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateCompanyModal;