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

export const ProjectListingPage=()=>{
    const dispatch=useAppDispatch();
    const navigate=useNavigate();
    const {companySlug}=useParams()
    const {projects,loading,total,limit,error}=useAppSelector(state=>state.project)

    const [search,setSearch]=useState('');
    const [status,setStatus]=useState<ProjectStatus|"">("");
    const [currentPage,setCurrentPage]=useState(1);
    const [openCreate,setOpenCreate]=useState(false)
    const [deleteTarget,setDeleteTarget]=useState<{id:string;name:string}|null>(null)
    const debouncedSearch=useDebounce(search,500)


    useEffect(()=>{
        dispatch(listProjects({
            page:currentPage,
            limit,
            search:debouncedSearch||undefined,
            status:status||undefined
        }))
    },[dispatch,currentPage,debouncedSearch,status,limit])

    const totalPages=Math.ceil(total/limit)

   return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage all your company projects
          </p>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Add Project
        </button>
      </div>

      {/* Stats */}
      <ProjectStats projects={projects} />

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded w-64"
        />

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as ProjectStatus | "");
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Loading */}
      {loading && <p>Loading projects...</p>}

      {/* Table */}
      {!loading && (
        <ProjectTable
          projects={projects}
          onView={(projectId) =>
            navigate(`/company/${companySlug}/projects/${projectId}`)
          }
          onDelete={(id)=>{
            const project=projects.find((p)=>p.id===id)
            if(project){
                setDeleteTarget({id,name:project.name})
            }
          }
          }
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
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