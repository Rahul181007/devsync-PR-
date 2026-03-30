import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
  getProjectTimesheet,
  getProjectWorklogs,
} from "../../store/worklog.slice";
import Spinner from "../../../../shared/components/LoadingSpinner";
import {
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  CalendarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface Props {
  projectId: string;
}

interface TimesheetItem {
  date: string;
  totalHours: number;
  userName?: string;
  tasks?: Array<{
    taskTitle: string;
    timeSpent: number;
  }>;
}

export const ProjectWorklogTab = ({ projectId }: Props) => {
  const dispatch = useAppDispatch();

  const [view, setView] = useState<"worklog" | "timesheet">("worklog");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<string>("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { projectWorklogs, projectTimesheet, loading } = useAppSelector(
    (state) => state.adminWorklog
  );

  useEffect(() => {
    if (view === "worklog") {
      dispatch(getProjectWorklogs(projectId));
    } else {
      dispatch(getProjectTimesheet(projectId));
    }
  }, [dispatch, projectId, view]);

  const handleClearFilters = () => {
    setSearch("");
    setSelectedUser("ALL");
    setStartDate("");
    setEndDate("");
  };

  // Filter worklogs
  const filteredLogs = projectWorklogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.taskTitle.toLowerCase().includes(search.toLowerCase());

    const matchesUser =
      selectedUser === "ALL" || log.userId === selectedUser;

    const logDate = new Date(log.date);

    const matchesStart =
      !startDate || logDate >= new Date(startDate);

    const matchesEnd =
      !endDate || logDate <= new Date(endDate);

    return matchesSearch && matchesUser && matchesStart && matchesEnd;
  });

  // Filter timesheet
  const filteredTimesheet = projectTimesheet.filter((item: TimesheetItem) => {
    const itemDate = new Date(item.date);
    const matchesStart = !startDate || itemDate >= new Date(startDate);
    const matchesEnd = !endDate || itemDate <= new Date(endDate);
    
    if (selectedUser !== "ALL" && item.userName) {
      return matchesStart && matchesEnd && item.userName === selectedUser;
    }
    
    return matchesStart && matchesEnd;
  });

  // Calculate summary statistics for worklogs
  const totalHours =
    projectWorklogs.reduce((sum, log) => sum + log.timeSpent, 0) / 60;

  const uniqueDevelopers = new Set(
    projectWorklogs.map((log) => log.userId)
  ).size;

  const totalEntries = projectWorklogs.length;

  // Calculate timesheet summary
  const timesheetTotalHours = filteredTimesheet.reduce(
    (sum, item) => sum + item.totalHours,
    0
  );

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView("worklog")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            view === "worklog"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Worklogs
        </button>

        <button
          onClick={() => setView("timesheet")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            view === "timesheet"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Timesheet
        </button>
      </div>

      {/* Header with Stats */}
      <div className="bg-linear-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-900">
              {view === "worklog" ? "Worklogs" : "Timesheet"}
            </h2>
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {view === "worklog" ? "Last 30 days" : "Summary by date"}
          </div>
        </div>

        {/* Stats Cards */}
        {view === "worklog" ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Hours
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {totalHours.toFixed(1)}h
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <ClockIcon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Members
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {uniqueDevelopers}
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <UserIcon className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Entries
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {totalEntries}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <DocumentTextIcon className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Hours (Filtered)
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {timesheetTotalHours.toFixed(1)}h
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <ClockIcon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Days
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {filteredTimesheet.length}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder={
              view === "worklog"
                ? "Search task or developer..."
                : "Search by date..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex gap-2 items-center flex-wrap w-full sm:w-auto">
          {/* User Filter */}
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="ALL">All Developers</option>
            {view === "worklog" &&
              [...new Set(projectWorklogs.map((log) => log.userId))].map(
                (id) => {
                  const user = projectWorklogs.find((l) => l.userId === id);
                  return (
                    <option key={id} value={id}>
                      {user?.userName}
                    </option>
                  );
                }
              )}
            {view === "timesheet" &&
              [...new Set(projectTimesheet.map((item: TimesheetItem) => item.userName))].map(
                (name) => {
                  if (name) {
                    return (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    );
                  }
                  return null;
                }
              )}
          </select>

          {/* Date Filters */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            placeholder="Start date"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            placeholder="End date"
          />

          <button
            onClick={handleClearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
          >
            <XMarkIcon className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-100">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-gray-500">Loading...</p>
        </div>
      ) : view === "worklog" ? (
        // Worklogs View
        filteredLogs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <ClockIcon className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-700">No worklogs found</p>
            <p className="text-xs text-gray-400 mt-1">
              {search || selectedUser !== "ALL" || startDate || endDate
                ? "Try adjusting your filters"
                : "Worklogs will appear here once team members log their time"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-linear-to-r from-gray-50 to-gray-100/50 border-b border-gray-200 px-6 py-3">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5" />
                    Developer
                  </p>
                </div>
                <div className="col-span-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <DocumentTextIcon className="w-3.5 h-3.5" />
                    Task
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <ClockIcon className="w-3.5 h-3.5" />
                    Time
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    Date
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Description
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredLogs.map((log) => (
                <div key={log.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-xs font-medium text-white">
                            {log.userName?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {log.userName}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-4">
                      <span className="text-sm text-gray-700 truncate block">
                        {log.taskTitle}
                      </span>
                    </div>

                    <div className="col-span-1">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        <ClockIcon className="w-3 h-3" />
                        {(log.timeSpent / 60).toFixed(1)}h
                      </span>
                    </div>

                    <div className="col-span-2">
                      <span className="text-xs text-gray-500">
                        {new Date(log.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <p
                        className="text-sm text-gray-600 truncate"
                        title={log.description || ""}
                      >
                        {log.description || (
                          <span className="text-gray-400 italic">—</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Showing {filteredLogs.length} of {projectWorklogs.length}{" "}
                  entries
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Total:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {totalHours.toFixed(1)} hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        // Timesheet View
        filteredTimesheet.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <CalendarIcon className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-700">No timesheet data found</p>
            <p className="text-xs text-gray-400 mt-1">
              {selectedUser !== "ALL" || startDate || endDate
                ? "Try adjusting your filters"
                : "Timesheet data will appear here once available"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-linear-to-r from-gray-50 to-gray-100/50 border-b border-gray-200 px-6 py-3">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    Date
                  </p>
                </div>
                <div className="col-span-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5" />
                    Developer
                  </p>
                </div>
                <div className="col-span-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <ClockIcon className="w-3.5 h-3.5" />
                    Total Hours
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredTimesheet.map((item: TimesheetItem, index: number) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="col-span-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-linear-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-xs font-medium text-white">
                            {item.userName?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                        <span className="text-sm text-gray-700">
                          {item.userName || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                        <ClockIcon className="w-3.5 h-3.5" />
                        {item.totalHours.toFixed(1)}h
                      </span>
                    </div>
                  </div>

                  {/* Show tasks if available */}
                  {item.tasks && item.tasks.length > 0 && (
                    <div className="mt-3 ml-8 pl-4 border-l-2 border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">Tasks:</p>
                      <div className="space-y-1">
                        {item.tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className="flex items-center gap-2 text-sm">
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                            <span className="text-gray-600">{task.taskTitle}</span>
                            <span className="text-xs text-gray-400">
                              ({(task.timeSpent / 60).toFixed(1)}h)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Showing {filteredTimesheet.length} of {projectTimesheet.length}{" "}
                  entries
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Total Hours:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {timesheetTotalHours.toFixed(1)}h
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};