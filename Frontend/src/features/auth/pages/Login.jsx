import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({email,password})
        navigate('/')
    }

    if(loading){
        return (<main><h1>Loading.......</h1></main>)
    }


    return (
        <main className="auth-page">
            <section className="auth-brand-panel">
                <div className="auth-brand"><span className="brand-dot" /> <span>PrePilot</span></div>
                <div className="auth-brand-copy">
                    <h1>Walk in<br /><em>prepared.</em></h1>
                    <p>Paste a job description, add your resume, and get a plan built for that exact role.</p>
                    <div className="auth-tags"><span>Questions</span><span>Skill gaps</span><span>Roadmap</span></div>
                </div>
                <p className="auth-footer">Made for students landing their first role</p>
            </section>
            <section className="auth-form-panel">
                <div className="form-container">
                    <h1>Welcome back</h1>
                    <p className="form-subtitle">Log in to continue your prep.</p>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input onChange={(e) => { setEmail(e.target.value) }} type="email" id="email" name="email" placeholder="you@college.edu" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input onChange={(e) => { setPassword(e.target.value) }} type="password" id="password" name="password" placeholder="At least 8 characters" />
                        </div>
                        <button className="auth-submit" type="submit">Log in</button>
                    </form>
                    <p className="auth-switch">New here? <Link to="/register">Create an account</Link></p>
                </div>
            </section>
        </main>
    )
}

export default Login