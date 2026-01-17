import { GoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../../../store/hook";
import { googleLogin } from "../auth.slice";

const GoogleLoginButton = () => {
  const dispatch = useAppDispatch();

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        if (!credentialResponse.credential) return;
        dispatch(googleLogin(credentialResponse.credential));
      }}
      onError={() => {
        console.error("Google login failed");
      }}
      useOneTap={false}
      auto_select={false}
    />
  );
};

export default GoogleLoginButton;