const AuthIntroPanel= () => {
  return (
    <div className="max-w-md px-10">
      <h1 className="text-3xl font-bold mb-3">DevSync</h1>
      <p className="text-gray-300 mb-6">
        Powerful Collaboration for Modern Dev Teams
      </p>

      <div className="mt-10 space-y-4">
        <div className="bg-slate-800 p-4 rounded">
          Centralized Tenant Management
        </div>
        <div className="bg-slate-800 p-4 rounded">
          Secure Identity Federation
        </div>
        <div className="bg-slate-800 p-4 rounded">
          System Monitoring & Audit Logs
        </div>
      </div>
    </div>
  );
};

export default AuthIntroPanel;