interface AuthButtonProps {
    label:string;
    loading:boolean;
}


const AuthButton=({
    label,
    loading=false
}:AuthButtonProps)=>{
     return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
    >
      {loading ? "Please wait..." : label}
    </button>
  );
}

export default AuthButton;