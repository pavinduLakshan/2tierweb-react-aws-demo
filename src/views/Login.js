import React,{useState} from 'react';
import {Link,useNavigate} from "react-router-dom"
import {Auth} from "aws-amplify"

const Login = () => {
    const navigate = useNavigate()

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    async function login(e){
        e.preventDefault()
        await Auth.signIn(username,password)
        navigate("/")
    }

    return (
        <div>
                    <form onSubmit={login} style={{ width: "60%", display: "flex", flexDirection: "column" }}>
                        <label>Username/email</label>
            <input name="username" onChange={e => setUsername(e.target.value)}></input>
            <label>Password</label>
            <input name="password" onChange={e => setPassword(e.target.value)}></input>    
            <button type="submit">Login</button>
            <p>New? <Link to="/register">Register</Link></p>
        </form>    
        </div>
    );
};

export default Login;