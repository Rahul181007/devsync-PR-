import { useEffect, useState } from 'react';
import CreateCompanyModal from '../components/CreateCompanyModal';
import { useAppDispatch, useAppSelector } from '../../../store/hook';
import { approveCompany, fetchCompanies, setPage, setSearch, setStatus } from '../store/companies.slice';
import { useDebounce } from '../../../core/hooks/useDebounce';
import { clearAuthError } from '../../auth/auth.slice';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import RejectCompanyModal from '../components/RejectCompanyModal';
import { Table } from '../../../shared/components/table';

const CompaniesPage = () => {

    const dispatch = useAppDispatch();
    const { items, loading, page, total, limit, search, status } = useAppSelector((state) => state.companies)
    const [openCreate, setOpenCreate] = useState(false);
    const [rejectCompanyId, setRejectCompanyId] = useState<string | null>(null);
    const [openReject, setOpenReject] = useState(false);
    const debounceSearch = useDebounce(search, 500)
    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchCompanies({ page, limit, search: debounceSearch, status }))
    }, [dispatch, page, limit, debounceSearch, status]);

    const handleApprove = async (companyId: string) => {
        dispatch(approveCompany({ companyId, page, limit, search }))
    };
    const handleRejectClick = (companyid: string) => {
        setRejectCompanyId(companyid);
        setOpenReject(true)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "bg-green-100 text-green-800";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "REJECTED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    console.log("total", total, limit)
    const totalPages = Math.ceil((total || 0) / (limit || 1));


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading companies...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-6 md:mb-8 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
                        <p className="text-gray-600 mt-1">Manage and review registered companies</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

                            {/* Search */}
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Search companies..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    value={search}
                                    onChange={(e) => dispatch(setSearch(e.target.value))}
                                />
                                <div className="absolute left-3 top-2.5">
                                    <svg className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Filter */}
                            <select
                                value={status}
                                onChange={(e) =>
                                    dispatch(setStatus(e.target.value as typeof status))
                                }
                                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="ALL">All</option>
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="SUSPENDED">Suspended</option>
                            </select>

                        </div>
                        <button
                            onClick={() => setOpenCreate(true)}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
                        >
                            Add Company
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-blue-50">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Companies</p>
                            <p className="text-2xl font-semibold text-gray-900">{items.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-green-50">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Approved</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {items.filter(c => c.status === 'APPROVED').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-yellow-50">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {items.filter(c => c.status === 'PENDING').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Companies Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                    <Table
                        title="Company List"
                        data={items}
                        emptyText="No companies found"
                        getRowId={(company) => company.id}

                        // ✅ ADD THESE
                        page={page}
                        totalPages={totalPages}
                        onPageChange={(p) => dispatch(setPage(p))}

                        columns={[
                            {
                                header: "Company Name",
                                render: (company) => (
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <span className="text-blue-600 font-semibold">
                                                {company.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {company.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                ID: {company.id.substring(0, 8)}...
                                            </div>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                header: "Domain",
                                render: (company) => company.domain || "-",
                            },
                            {
                                header: "Status",
                                render: (company) => (
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                            company.status
                                        )}`}
                                    >
                                        {company.status}
                                    </span>
                                ),
                            },
                            {
                                header: "Actions",
                                align: "right",
                                render: (company) => (
                                    <div className="flex justify-end space-x-3">
                                        {company.status === "PENDING" && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(company.id)}
                                                    className="px-3 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    onClick={() => handleRejectClick(company.id)}
                                                    className="px-3 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}

                                        <Link
                                            to={ROUTES.SUPER_ADMIN.COMPANY_DETAIL(company.id)}
                                            className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            View
                                        </Link>
                                    </div>
                                ),
                            },
                        ]}
                    />
               
            </div>

            {/* Create Company Modal */}
            <CreateCompanyModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onCreated={() => dispatch(fetchCompanies({ page, limit, search, status }))}
            />

            <RejectCompanyModal
                open={openReject}
                companyId={rejectCompanyId}
                page={page}
                limit={limit}
                search={search}
                status={status}
                onClose={() => {
                    setOpenReject(false);
                    setRejectCompanyId(null);
                }}
            />

        </div>
    );
};

export default CompaniesPage;
