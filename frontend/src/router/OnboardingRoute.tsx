import { Navigate,Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hook";

const OnboardingRoute=()=>{
    const {isAuthenticated,requiresOnboarding,isAuthChecked}=useAppSelector((state)=>state.auth)
    if(!isAuthChecked) return <div>Loading....</div>
    
    if(!isAuthenticated){
        return <Navigate to='/company/login' replace/>
    }
    if(!requiresOnboarding){
        return <Navigate to='/company/dashboard' replace />
    }
    return <Outlet />

}

export default OnboardingRoute