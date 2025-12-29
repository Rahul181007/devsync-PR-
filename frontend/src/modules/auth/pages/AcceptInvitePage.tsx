import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { inviteService } from "../services/invite.service";
import { useNavigate } from "react-router-dom";

const AcceptInvitePage = () => {
    const location = useLocation();
    const navigate = useNavigate()

    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    
    const [loading,setLoading]=useState(true);
    const [verified,setVerified]=useState(false);
    const [email,setEmail]=useState<string|null>(null);
    const [companyName,setCompanyName]=useState<string|null>(null)




    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    
    useEffect(()=>{
        if(!token)return ;

        const verify=async ()=>{
            try {
                const res=await inviteService.verifyInvite(token);
                setEmail(res.data.data.email);
                setCompanyName(res.data.data.companyName);
                setVerified(true);
            } catch  {
                setError('Inivte is invalid or expired')
            }finally{
                setLoading(false)
            }
        }
        verify()
    },[token])

    if(loading){
       return <div style={{ padding: "2rem" }}>Verifying invite...</div>;
    }

    if(error){
         return (
      <div style={{ padding: "2rem" }}>
        <h2>Invite Error</h2>
        <p>{error}</p>
      </div>
    ); 
    }

    if(!verified) return null

    const handleSubmit = async () => {
        try {
            setError(null);

            if (!token) {
                setError("Invalid invite token");
                return;
            }

            if (password.length < 6) {
                setError("Password must be at least 6 characters");
                return;
            }

            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            await inviteService.acceptInvite({
                token,
                password,
            });

            navigate("/company/login", {
                state: { message: "Account created successfully. Please login." },
            });

        } catch  {
            setError( "Failed to accept invite");
        }
    };

    if (!token) {
        return (
            <div style={{ padding: "2rem" }}>
                <h2>Invite Error</h2>
                <p>Invalid or missing invite token</p>
            </div>
        );
    }

     return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Set Your Password</h2>

      <p>
        Invited as <strong>{email}</strong>
      </p>
      <p>
        Company: <strong>{companyName}</strong>
      </p>

      <div style={{ marginBottom: "1rem" }}>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit}>Set Password</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AcceptInvitePage;

