import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import "./Sign-up.css"

export default function Signup() {
    const [fullname, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("") // ❗ red text
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMsg("")

        try {
            setLoading(true)
            const resp = await fetch(`https://back-project-olive.vercel.app/auth/sign-up`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ fullname, email, password })
            })

            const data = await resp.json()

            if (resp.status === 201) {
                toast.success('User registered successfully')
                navigate('/SignIn')
            } else {
                setErrorMsg(data.message || "Something went wrong") // ❗ red text
            }
        } catch (e) {
            setErrorMsg(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="sign-wrapper">
            <div className='container'>
                <h1 className='tag'>Sign-up</h1>

                <form onSubmit={handleSubmit} className='frm'>
                    <input 
                        type="text" 
                        placeholder='Full Name' 
                        value={fullname} 
                        onChange={(e) => setFullName(e.target.value)} 
                        required
                        className='inp1'
                    />
                    <input 
                        type="email" 
                        placeholder='Email' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                        className='inp1'
                    />
                    <input 
                        type="password" 
                        placeholder='********' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                        className='inp1'
                    />

                    {/* ❗ RED ERROR MESSAGE */}
                    {errorMsg && <p className="error-text">{errorMsg}</p>}

                    <button className='btn2'>{loading ? 'loading..' : 'Sign-up'}</button>

                    <h2 className='sign'>Already have an account? <Link to={'/SignIn'}>Sign-in</Link></h2>
                </form>
            </div>
        </div>
    )
}
