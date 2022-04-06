import React, { useState } from 'react';
import {Auth} from "aws-amplify"
import {Link} from "react-router-dom"

const Register = () => {
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const [confirmationCode,setConfirmationCode] = useState()
    const [step, setStep] = useState(0)

    async function register(e){
        e.preventDefault()
        try {
            await Auth.signUp({username,password,attributes: {email}})
            console.log("Successfully signed up!")
            setStep(1)
        } catch (err){
            console.error("Error when registering user: "+err)
        }
    }
    
    async function confirmRegistration(e){
        e.preventDefault()
        try {
            await Auth.confirmSignUp(username,confirmationCode)
            console.log("User successfully confirmed!")
        } catch (err){
            console.error("Error confirming registration: "+ err)
        }
    }

    return (
        <div>
            {step ===0 && <form onSubmit={register} style={{ width: "60%", display: "flex", flexDirection: "column" }}>
                <label>Username</label>
                <input name="userName" onChange={e => setUsername(e.target.value)}></input>

                <label>Email</label>
                <input name="email" onChange={e => setEmail(e.target.value)}></input>

                <label>Password</label>
                <input name="password" onChange={e => setPassword(e.target.value)}></input>
                <button type="submit">register</button>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </form>}
            {step === 1 && <form onSubmit={confirmRegistration} style={{ width: "60%", display: "flex", flexDirection: "column" }}>
                <label>Confirmation code</label>
                <input name="confirmationCode" onChange={e => setConfirmationCode(e.target.value)}></input>

                <button type="submit">register</button>
            </form>}
        </div>
    );
};

export default Register;