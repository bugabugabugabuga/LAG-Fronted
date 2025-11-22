import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Signup() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try{
            setLoading(true)
            const resp = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/sign-up`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    password
                })
            })
            const data = await resp.json()

            if(resp.status === 201){
                toast.success('user registed succesfulyl')
                navigate('/sign-in')
            }else{
                toast.error(data.message)
                console.log(data)
            }
        }catch(e){
            toast.error(e.message)
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <h1>Sign-up</h1>

            <form onSubmit={handleSubmit} className='flex flex-col w-[400px] gap-2'>
                <input 
                    type="text" 
                    placeholder='full Name' 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    required
                    className='border-2 border-black'
                />
                 <input 
                    type="email" 
                    placeholder='email' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                    className='border-2 border-black'
                />
                 <input 
                    type="password" 
                    placeholder='********' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                    className='border-2 border-black'
                />

                <button className='p-2 bg-blue-500'>{loading ? 'loading..': 'Sign-up'}</button>
                <h2>Already have account? <Link to={'/sign-in'}>Sign-in</Link></h2>
            </form>
        </div>
    )
}