import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import type { Plan, PlanStatusFilter } from "../../typess/plan.types";
import { listPlans } from "../../store/plan.slice";
import PlanModal from "../../components/plans/PlanModel";
import PlanTable from "../../components/plans/PlanTable";
import { useDebounce } from "../../../../core/hooks/useDebounce";
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const PlanListPage = () => {
    const dispatch = useAppDispatch();
    const { plans, page, limit, total, loading } = useAppSelector(
        (state) => state.plans
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<PlanStatusFilter>("all");
    const debouncedSearch = useDebounce(search, 500)
    
    useEffect(() => {
        dispatch(
            listPlans({
                page,
                limit,
                search: debouncedSearch,
                status: statusFilter
            })
        );
    }, [dispatch, page, limit, debouncedSearch, statusFilter]);

    const handleCreate = () => {
        setSelectedPlan(null);
        setIsModalOpen(true);
    };

    const handleEdit = (plan: Plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const totalPages = Math.ceil(total / limit);

    const handlePageChange = (newPage: number) => {
        dispatch(
            listPlans({
                page: newPage,
                limit,
                search: debouncedSearch,
                status: statusFilter
            })
        );
    };

    // Stats
    const totalPlans = total;
    const activePlans = plans.filter((p) => p.isActive).length;
    const inactivePlans = plans.filter((p) => !p.isActive).length;

    const statCards = [
        {
            title: "Total Plans",
            value: totalPlans,
            icon: DocumentTextIcon,
            color: "blue",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
            iconBg: "bg-blue-100"
        },
        {
            title: "Active",
            value: activePlans,
            icon: CheckCircleIcon,
            color: "green",
            bgColor: "bg-green-50",
            textColor: "text-green-600",
            iconBg: "bg-green-100"
        },
        {
            title: "Inactive",
            value: inactivePlans,
            icon: XCircleIcon,
            color: "red",
            bgColor: "bg-red-50",
            textColor: "text-red-600",
            iconBg: "bg-red-100"
        }
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Plans</h1>
                        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                            <span className="inline-block w-1 h-1 rounded-full bg-gray-400"></span>
                            Manage and review subscription plans
                        </p>
                    </div>
                    
                    {/* Action Buttons - Moved to right side */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search plans..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-64 lg:w-80 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm 
                                         focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                                         transition-all duration-200 group-hover:border-gray-300"
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
                        </div>

                        {/* Filter Dropdown */}
                        <div className="relative group">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as PlanStatusFilter)}
                                className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl 
                                         text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                                         transition-all duration-200 cursor-pointer hover:border-gray-300 min-w-[130px]"
                            >
                                <option value="all">All Plans</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <FunnelIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
                        </div>

                        {/* Add Plan Button */}
                        <button
                            onClick={handleCreate}
                            className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                                     text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 
                                     flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-xl 
                                     hover:shadow-blue-600/30 transform hover:-translate-y-0.5"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Add Plan
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl 
                                     transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                        >
                            {/* Decorative gradient line */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-${stat.color}-500 to-${stat.color}-400 rounded-t-2xl`}></div>
                            
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                                        {stat.title}
                                    </p>
                                    <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`${stat.iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className={`w-5 h-5 ${stat.textColor}`} />
                                </div>
                            </div>
                            
                            {/* Mini trend indicator */}
                            <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                                <span className="inline-block w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <span 
                                        className={`block h-full bg-${stat.color}-500 rounded-full`} 
                                        style={{ width: `${Math.min(100, (stat.value / totalPlans) * 100)}%` }}
                                    ></span>
                                </span>
                                <span>{Math.round((stat.value / totalPlans) * 100)}% of total</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <PlanTable
                    plans={plans}
                    loading={loading}
                    onEdit={handleEdit}
                    search={debouncedSearch}
                    status={statusFilter}
                />
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-medium text-gray-700">{((page - 1) * limit) + 1}</span> to{' '}
                        <span className="font-medium text-gray-700">{Math.min(page * limit, total)}</span> of{' '}
                        <span className="font-medium text-gray-700">{total}</span> plans
                    </p>
                    
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 
                                ${page === 1 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow'
                                }`}
                        >
                            Previous
                        </button>
                        
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }).map((_, index) => {
                                const pageNumber = index + 1;
                                
                                // Show limited page numbers with ellipsis
                                if (
                                    totalPages > 7 &&
                                    pageNumber > 2 &&
                                    pageNumber < totalPages - 1 &&
                                    Math.abs(pageNumber - page) > 2
                                ) {
                                    if (pageNumber === 3 && page > 4) {
                                        return <span key="ellipsis1" className="px-3 py-2 text-gray-500">...</span>;
                                    }
                                    if (pageNumber === totalPages - 2 && page < totalPages - 3) {
                                        return <span key="ellipsis2" className="px-3 py-2 text-gray-500">...</span>;
                                    }
                                    return null;
                                }

                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`min-w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200
                                            ${pageNumber === page
                                                ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/20'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className={`px-3 py-2 rounded-lg text-sm transition-all duration-200
                                ${page === totalPages 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow'
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            <PlanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                plan={selectedPlan}
            />
        </div>
    );
};

export default PlanListPage;