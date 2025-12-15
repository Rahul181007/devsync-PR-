const TopBar=()=>{
    return(
           <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <h1 className="font-semibold">Super Admin</h1>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Super Admin</span>
        <div className="w-8 h-8 rounded-full bg-slate-300" />
      </div>
    </header> 
    )
}

export default TopBar;