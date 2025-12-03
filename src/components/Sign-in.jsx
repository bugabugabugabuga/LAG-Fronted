import React, { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import "./Sign-In.css" 
import GoogleLogo from "../assets/google.png";

export default function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const resp = await fetch(`https://back-project-olive.vercel.app/auth/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })
            const data = await resp.json()
            console.log(resp)
            console.log(data)

            if (resp.status === 200) {
                Cookies.set('token', data, { expires: 1 / 24 })
                toast.success('Logged in scuccessly')
                navigate('/')
            } else {
                toast.error(data.message)
                console.log(data)
            }
        } catch (e) {
            toast.error(e.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (searchParams.get('token')) {
            Cookies.set('token', searchParams.get('token'), { expires: 60 * 60 })
            toast.success('Logged in scuccessly')
            navigate('/')
        }
    }, [])

    return (
        <div className="sign-wrapper">
        <div className='container'>
            <h1 className='tag'>Sign-in</h1>

            <form clas onSubmit={handleSubmit} className='frm'>
                <input
                    type="email"
                    placeholder='email'
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

                <button className='btn2'>{loading ? 'loading..' : 'Sign-in'}</button>
            </form>

  <Link to="https://back-project-olive.vercel.app/auth/google" className="google-btn">
     <img src={GoogleLogo} alt="Google Logo" className="google-logo" />
     <span>Continue with Google</span>
     </Link>

            <h2 className='sign'>Dont have an account? <Link to={'/SignUp'}>Sign-up</Link></h2>
        </div>
        </div>
    )
}