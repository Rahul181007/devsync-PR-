import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hook"
import { useState } from "react";
import { createFirstProject } from "../../store/project.slice";
import { ROUTES } from "../../../../shared/constants/routes";

const CreateProjectPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.project);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) return;
   
    const res = await dispatch(
      createFirstProject({
        name,
        description: description || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      })
    );

    if (createFirstProject.fulfilled.match(res)) {
      navigate(ROUTES.COMPANY_ADMIN.COMPANY_PENDING_APPROVAL, { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-xl font-semibold mb-4">
        Create your first project
      </h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <input
        className="w-full border px-3 py-2 mb-3"
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        className="w-full border px-3 py-2 mb-3"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="date"
        className="w-full border px-3 py-2 mb-3"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <input
        type="date"
        className="w-full border px-3 py-2 mb-4"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white w-full py-2"
      >
        {loading ? "Creating..." : "Finish Setup"}
      </button>
    </div>
  );
};

export default CreateProjectPage;