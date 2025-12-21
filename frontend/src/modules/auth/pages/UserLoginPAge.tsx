import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/LoginForm";
import { useAppDispatch,useAppSelector } from "../../../store/hook";
import { userLogin } from "../auth.slice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserLoginPage=()=>{
    const dispatch=useAppDispatch();
    const navigate=useNavigate();
    const {loading,error,isAuthenticated,user}=useAppSelector((state)=>state.auth)
    
    const  handleSubmit=(data:{
        email:string;
        password:string
    })=>{
        dispatch(userLogin(data))
    }

    useEffect(()=>{
        if(user?.role==='COMPANY_ADMIN'){
            navigate('/company/dashboard')
        }else if( user?.role==='DEVELOPER'){
            navigate('/developer/dashboard')
        }
    },[isAuthenticated,user,navigate])


    return(
        <AuthLayout 
        left={null}
        right={
            <LoginForm 
            title="Welcome Back"
            subtitle="Login to workspace"
            loading={loading}
            error={error}
            onSubmit={handleSubmit}
            />
        }        
        />
    )
}

export default UserLoginPage