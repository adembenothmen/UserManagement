import  { useState } from 'react';
import Axios from 'axios';
import {useCookies} from 'react-cookie';
import {Container,Form,Button} from 'react-bootstrap';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const Auth = ({ onLoginSuccess }) => {

  return (
    <div>
        <>
          <Register />
          <Login onLoginSuccess={onLoginSuccess} />
        </>
      
    </div>
  );
};


const Register =()=>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit= async(e)=>{
        e.preventDefault();
        await Axios.post("http://localhost:3001/register",{username,password})
        toast.success("account created.", {
            position: "top-right",
            autoClose: 1500, 
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
    return (
        <>
            <AuthForm 
                label="Register"
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                onSubmit={onSubmit}
            />
                <ToastContainer />
        </>
        

    )
}


const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [, setCookies] = useCookies(["access_token"]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post("http://localhost:3001/login", {
        username,
        password,
      });

      // ✅ تحقق من أن البيانات صحيحة
      if (response.data && response.data.token && response.data.adminId) {
        setCookies("access_token", response.data.token);
        window.localStorage.setItem("adminId", response.data.adminId);

        // 🔑 فقط الآن نستدعي onLoginSuccess
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } 
    }catch (err) {
       toast.error("Invalid login credentials.", {
            position: "top-right",
            autoClose: 1500, 
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
  };

  return (
    <>
        <AuthForm
        label="login"
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        onSubmit={onSubmit}
        />
        <ToastContainer />
    </>
  
  );
};




const AuthForm = ({label,username,setUsername,password,setPassword,onSubmit}) => {
    return(
        <Container>
            <form className="form" onSubmit={onSubmit}> 
                <h2 className="text-blue">{label}</h2>
                <Form.Control type="text" id="username" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
                <Form.Control type="text" id="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
                <Button variant="success" type="submit">{label}</Button>
                
            </form>
        </Container>
    

    );
}

export default Auth