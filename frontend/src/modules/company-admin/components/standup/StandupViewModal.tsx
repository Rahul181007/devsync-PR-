import { useAppSelector } from "../../../../store/hook";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const StandupViewModal = ({ isOpen, onClose }: Props) => {
  const { selectedStandup, loading } = useAppSelector(
    (state) => state.companyStandup
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6 space-y-5">

        <h2 className="text-lg font-semibold">
          Standup Submission
        </h2>

        {loading && <p>Loading...</p>}

        {selectedStandup && (
          <>
            <Section title="Yesterday">
              {selectedStandup.yesterday}
            </Section>

            <Section title="Today">
              {selectedStandup.today}
            </Section>

            <Section title="Blockers">
              {selectedStandup.blockers || "No blockers"}
            </Section>

            <div className="flex justify-between text-sm text-gray-500">
              <span>Mood: {selectedStandup.mood}</span>
              <span>
                Updated:{" "}
                {new Date(
                  selectedStandup.updatedAt
                ).toLocaleString()}
              </span>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <p className="text-sm font-medium text-gray-500 mb-1">
      {title}
    </p>
    <div className="bg-gray-50 p-3 rounded-lg text-sm">
      {children}
    </div>
  </div>
);

export default StandupViewModal;