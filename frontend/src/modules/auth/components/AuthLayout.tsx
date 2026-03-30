interface AuthLayoutProps {
    left: React.ReactNode;
    right: React.ReactNode;
}

const AuthLayout = ({ left, right }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
            {/* Left Panel - Gradient Background with Animation */}
            <div className="hidden lg:flex relative items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }} />
                </div>
                
                {/* Animated Gradient Orbs */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
                
                {/* Content Container with Animation */}
                <div className="relative z-10 w-full max-w-lg px-8 animate-fade-in-up">
                    {left}
                </div>
            </div>
            
            {/* Right Panel - Clean White with Subtle Pattern */}
            <div className="relative flex items-center justify-center bg-linear-to-br from-white via-gray-50 to-white overflow-y-auto">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 1px)`,
                        backgroundSize: '32px 32px'
                    }} />
                </div>
                
                {/* Content Container with Animation */}
                <div className="relative z-10 w-full max-w-md px-4 py-12 animate-fade-in">
                    {right}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;