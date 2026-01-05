type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

const ErrorState = ({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) => {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-red-500 text-3xl mb-3">⚠️</div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {title}
        </h2>

        <p className="text-gray-600 mb-4">{message}</p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
