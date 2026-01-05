import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🚫</div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Page Not Found
        </h1>

        <p className="text-gray-600 mb-6">
          The page you are looking for doesn’t exist.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
