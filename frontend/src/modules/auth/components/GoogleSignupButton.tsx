import { GoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../../../store/hook"
import { googleSignup } from "../auth.slice";

const GoogleSignupButton=()=>{
    const dispatch=useAppDispatch();

    return (
        <GoogleLogin
        text="signup_with" 
        onSuccess={(credentialResponse)=>{
            if(!credentialResponse.credential) return
            dispatch(googleSignup(credentialResponse.credential));
        }}
        onError={()=>{
            console.error('Google signup failed')
        }}
        useOneTap={false}
         auto_select={false}
        />
    )
}

export default GoogleSignupButton