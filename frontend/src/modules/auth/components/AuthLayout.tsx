interface AuthLayoutProps {
    left:React.ReactNode,
    right:React.ReactNode
}

const AuthLayout=({left,right}:AuthLayoutProps)=>{
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex items-center justify-center bg-slate-900 text-white">
        {left}
      </div>
      <div className="flex items-center justify-center bg-white">
        {right}
      </div>
    </div>
  );
}

export default AuthLayout