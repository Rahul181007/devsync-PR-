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
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface Props {
  projectId: string;
}

interface TimesheetGrouped {
  totalHours: number;
  entries: {
    userName?: string;
    hours: number;
    tasks: {
      taskTitle: string;
      timeSpent: number;
    }[];
  }[];
}

export const ProjectWorklogTab = ({ projectId }: Props) => {
  const dispatch = useAppDispatch();

  const [view, setView] = useState<"worklog" | "timesheet">("worklog");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<string>("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dates = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    return date.toLocaleDateString("en-CA");
  });

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

    const matchesUser = selectedUser === "ALL" || log.userId === selectedUser;
    const logDate = new Date(log.date);
    const matchesStart = !startDate || logDate >= new Date(startDate);
    const matchesEnd = !endDate || logDate <= new Date(endDate);

    return matchesSearch && matchesUser && matchesStart && matchesEnd;
  });

  // Filter timesheet - only by user, not by date
  const filteredTimesheet = projectTimesheet.filter((item) => {
    if (selectedUser !== "ALL" && item.userName) {
      return item.userName === selectedUser;
    }
    return true;
  });

  const timesheetMap = filteredTimesheet.reduce((acc, item) => {
    const key = new Date(item.date).toLocaleDateString("en-CA");

    if (!acc[key]) {
      acc[key] = {
        totalHours: 0,
        entries: [],
      };
    }

    acc[key].totalHours += item.totalHours;

    acc[key].entries.push({
      userName: item.userName,
      hours: item.totalHours,
      tasks: item.tasks || [],
    });

    return acc;
  }, {} as Record<string, TimesheetGrouped>);

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
            {view === "worklog" ? "Last 30 days" : "Monthly calendar view"}
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
                    Total Hours
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
                    {Object.keys(timesheetMap).length}
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
                : "Search by developer..."
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
              [...new Set(projectTimesheet.map((item) => item.userName))].map(
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

          {/* Date Filters - Only show for worklogs view */}
          {view === "worklog" && (
            <>
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
            </>
          )}

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
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gray-50 rounded-full">
                <CalendarIcon className="w-10 h-10 text-gray-400" />
              </div>
            </div>
            <p className="text-base font-medium text-gray-700">No timesheet data found</p>
            <p className="text-sm text-gray-400 mt-1">
              {selectedUser !== "ALL"
                ? "No data found for selected developer"
                : "Timesheet data will appear here once available"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header with Month Navigation */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700">Monthly Calendar</h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
                </button>

                <span className="text-base font-semibold text-gray-800 min-w-[140px] text-center">
                  {currentDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>

                <button
                  onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="w-5"></div>
            </div>

            {/* Calendar */}
            <div className="p-6">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold text-gray-500 py-2"
                  >
                    {day.substring(0, 3)}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {dates.map((date) => {
                  const data = timesheetMap[date];
                  const isToday = date === new Date().toLocaleDateString("en-CA");
                  const dateObj = new Date(date);
                  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

                  return (
                    <div
                      key={date}
                      onClick={() => data && setSelectedDate(date)}
                      className={`
                        ${data ? "cursor-pointer" : "cursor-default"}                      
                        min-h-[120px] p-3 rounded-xl border transition-all duration-200
                        ${isToday
                          ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200 ring-opacity-50"
                          : isWeekend
                            ? "bg-gray-50/50 border-gray-200"
                            : data
                              ? "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                              : "bg-gray-50/30 border-gray-200"
                        }
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`
                          text-sm font-semibold
                          ${isToday ? "text-blue-700" : isWeekend ? "text-gray-400" : "text-gray-700"}
                        `}>
                          {dateObj.getDate()}
                        </span>
                        {data && (
                          <span className="text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
                            {data.totalHours.toFixed(1)}h
                          </span>
                        )}
                      </div>

                      {data && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-600">
                            {data.entries.length} dev{data.entries.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      )}

                      {!data && (
                        <div className="flex items-center justify-center h-16">
                          <span className="text-xs text-gray-300">—</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{Object.keys(timesheetMap).length}</span> days with activity
                </span>
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="text-gray-600">
                  Total <span className="font-semibold text-gray-900">{filteredTimesheet.length}</span> entries
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Total Hours:</span>
                <span className="text-xl font-bold text-gray-900">
                  {timesheetTotalHours.toFixed(1)}
                  <span className="text-sm font-normal text-gray-500 ml-1">hours</span>
                </span>
              </div>
            </div>
          </div>
        )
      )}

      {/* Enhanced Modal */}
      {selectedDate && timesheetMap[selectedDate] && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200"
          onClick={() => setSelectedDate(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-[500px] max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Total: {timesheetMap[selectedDate].totalHours.toFixed(1)} hours
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              {timesheetMap[selectedDate].entries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-3 bg-gray-100 rounded-full inline-flex mb-3">
                    <ClockIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No entries for this day</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {timesheetMap[selectedDate].entries.map((entry, idx) => (
                    <div 
                      key={idx} 
                      className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-white">
                              {entry.userName?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {entry.userName || "Unknown User"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {entry.hours.toFixed(1)} hours logged
                            </p>
                          </div>
                        </div>
                        <div className="px-2 py-1 bg-blue-100 rounded-lg">
                          <span className="text-xs font-semibold text-blue-700">
                            {entry.hours.toFixed(1)}h
                          </span>
                        </div>
                      </div>

                      {entry.tasks.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Tasks
                          </p>
                          <div className="space-y-1.5">
                            {entry.tasks.map((task, taskIdx) => (
                              <div 
                                key={taskIdx} 
                                className="flex items-start gap-2 text-sm p-2 bg-white rounded-lg"
                              >
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                                <div className="flex-1">
                                  <p className="text-gray-700">{task.taskTitle}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {(task.timeSpent / 60).toFixed(1)} hours
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {entry.tasks.length === 0 && (
                        <p className="text-sm text-gray-400 italic">No tasks logged</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setSelectedDate(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};