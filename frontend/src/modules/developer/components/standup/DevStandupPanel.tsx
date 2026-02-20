import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook"
import { fetchDeveloperStandups } from "../../store/standup.slice";

import StandupModal from "./StandupForm";
import Spinner from "../../../../shared/components/LoadingSpinner";

interface Props{
    projectId:string
}

const DevStandupPanel = ({projectId}:Props) => {
    const dispatch=useAppDispatch();
    const {data,loading,error}=useAppSelector((state)=>state.devStandup)
      const [openModal, setOpenModal] = useState(false);
    useEffect(()=>{
        dispatch(fetchDeveloperStandups(projectId))
    },[dispatch,projectId])

      if (loading)
  return (
    <div className="p-6 flex justify-center">
      <Spinner size="lg" />
    </div>
  );;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!data) return null;
return (
    <div className="space-y-6">
<div className="bg-white p-6 rounded-xl shadow space-y-3">
  <h2 className="text-lg font-semibold">Today's Standup</h2>

  {data.todayStandup ? (
    <>
      <p><strong>Yesterday:</strong> {data.todayStandup.yesterday}</p>
      <p><strong>Today:</strong> {data.todayStandup.today}</p>
      <p><strong>Mood:</strong> {data.todayStandup.mood}</p>

      <button
        onClick={() => setOpenModal(true)}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Update
      </button>
    </>
  ) : (
    <>
      <p className="text-gray-500 text-sm">
        You have not submitted today's standup.
      </p>

      <button
        onClick={() => setOpenModal(true)}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Submit Standup
      </button>
    </>
  )}
</div>

{openModal && (
  <StandupModal
    projectId={projectId}
    todayStandup={data.todayStandup}
    onClose={() => setOpenModal(false)}
  />
)}

      {/* History Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Standup History</h2>

        {data.history.length === 0 ? (
          <p className="text-gray-500 text-sm">No standup history yet.</p>
        ) : (
          <div className="space-y-4">
            {data.history.map((standup) => (
              <div
                key={standup.id}
                className="border rounded-lg p-4 text-sm"
              >
                <p className="text-gray-500 mb-1">
                  {new Date(standup.standupDate).toLocaleDateString()}
                </p>

                <p>
                  <span className="font-medium">Yesterday:</span>{" "}
                  {standup.yesterday}
                </p>

                <p>
                  <span className="font-medium">Today:</span>{" "}
                  {standup.today}
                </p>

                <p>
                  <span className="font-medium">Mood:</span>{" "}
                  {standup.mood}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


export default DevStandupPanel
