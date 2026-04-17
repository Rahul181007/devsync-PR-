// DevelopersPage.tsx - Fixed for responsive
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hook"
import { clearDeveloperError, fetchDevelopers } from "../store/developer.slice";
import { DeveloperTable } from "../components/DeveloperTable";
import { InviteDeveloperModal } from "../components/InviteDeveloperModal";
import Spinner from "../../../shared/components/LoadingSpinner";

type DeveloperStatusFilter = "ACTIVE" | "BLOCKED" | "";
export const DevelopersPage = () => {
  const dispatch = useAppDispatch();

  const {
    items,
    pagination,
    loading,
    error,
  } = useAppSelector(state => state.companyAdminDevelopers);

  const [openInvite, setOpenInvite] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<DeveloperStatusFilter>("");

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(
      fetchDevelopers({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        status: status || undefined,
      })
    );

    return () => {
      dispatch(clearDeveloperError());
    };
  }, [dispatch, page, debouncedSearch, status]);

  return (
    <>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 px-4 md:px-6 pt-4 md:pt-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Developers</h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">Manage your team's developers</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <input
                  type="text"
                  placeholder="Search developers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute left-3 top-2.5">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as DeveloperStatusFilter);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm md:text-base"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="BLOCKED">Blocked</option>
              </select>
              
              <button
                onClick={() => setOpenInvite(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 text-sm md:text-base whitespace-nowrap"
              >
                Invite Developer
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 px-4 md:px-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow p-3 md:p-6">
            <div className="flex items-center">
              <div className="p-2 md:p-3 rounded-lg bg-blue-50">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm text-gray-600">Total Developers</p>
                <p className="text-lg md:text-2xl font-semibold text-gray-900">{items.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-3 md:p-6">
            <div className="flex items-center">
              <div className="p-2 md:p-3 rounded-lg bg-green-50">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm text-gray-600">Active</p>
                <p className="text-lg md:text-2xl font-semibold text-gray-900">
                  {items.filter(d => d.status === 'ACTIVE').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-3 md:p-6">
            <div className="flex items-center">
              <div className="p-2 md:p-3 rounded-lg bg-red-50">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm text-gray-600">Blocked</p>
                <p className="text-lg md:text-2xl font-semibold text-gray-900">
                  {items.filter(d => d.status === 'BLOCKED').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="p-6 flex justify-center">
            <Spinner size="lg" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 mb-6 mx-4 md:mx-6">
            <div className="flex">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading developers</h3>
                <div className="mt-1 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="px-4 md:px-6 mb-6 w-full">
              <DeveloperTable developers={items} />
            </div>

            {pagination.totalPages >= 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 md:px-6 pb-8">
                <button
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </button>

                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <InviteDeveloperModal
        open={openInvite}
        onClose={() => {
          dispatch(clearDeveloperError());
          setOpenInvite(false);
        }}
      />
    </>
  );
};