const ServerErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="text-center">
        <div className="text-6xl mb-4">💥</div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Server Error
        </h1>

        <p className="text-gray-600 mb-6">
          Something went wrong on our side. Please try again later.
        </p>
      </div>
    </div>
  );
};

export default ServerErrorPage;
