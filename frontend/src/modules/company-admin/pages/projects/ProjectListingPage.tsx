import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook"
import type { ProjectStatus } from "../../types/project.types";
import { useDebounce } from "../../../../core/hooks/useDebounce";
import { deleteProject, listProjects } from "../../store/project.slice";
import CreateProjectModal from "../../components/project/CreateProjectModal";
import { ProjectTable } from "../../components/project/ProjectTable";
import { ProjectStats } from "../../components/project/ProjectStats";
import { useNavigate, useParams } from "react-router-dom";
import DeleteProjectModal from "../../components/project/DeleteProjectModal";
import Spinner from "../../../../shared/components/LoadingSpinner";

export const ProjectListingPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { companySlug } = useParams()
  const { projects, loading, total, limit} = useAppSelector(state => state.project)

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProjectStatus | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openCreate, setOpenCreate] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const debouncedSearch = useDebounce(search, 500)


  useEffect(() => {
    dispatch(listProjects({
      page: currentPage,
      limit,
      search: debouncedSearch || undefined,
      status: status || undefined
    }))
  }, [dispatch, currentPage, debouncedSearch, status, limit])

  const totalPages = Math.ceil(total / limit)
  console.log("pagination debug →", {
    total,
    limit,
    totalPages,
    currentPage,
  });


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">
              Manage all your company projects
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
              <div className="absolute left-3 top-2.5">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as ProjectStatus | "");
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            <button
              onClick={() => setOpenCreate(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
            >
              Add Project
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <ProjectStats projects={projects} />



      {/* Loading */}
      {loading &&
        <div className="p-6 flex justify-center">
          <Spinner size="lg" />
        </div>}

      {/* Table */}
      {!loading && (
        <ProjectTable
          projects={projects}
          onView={(projectId) =>
            navigate(`/company/${companySlug}/projects/${projectId}`)
          }
          onDelete={(id) => {
            const project = projects.find((p) => p.id === id)
            if (project) {
              setDeleteTarget({ id, name: project.name })
            }
          }
          }
        />
      )}

      {/* Pagination */}
      {totalPages >= 1 && (
        <div className="flex gap-2 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-2 py-1">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={() => {
          setCurrentPage(1);
          dispatch(
            listProjects({
              page: 1,
              limit,
              search: debouncedSearch || undefined,
              status: status || undefined,
            })
          );
        }}
      />

      <DeleteProjectModal
        open={!!deleteTarget}
        projectName={deleteTarget?.name || ""}
        loading={loading}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await dispatch(deleteProject({ projectId: deleteTarget.id }));
          setDeleteTarget(null);
        }}
      />
    </div>
  );
};