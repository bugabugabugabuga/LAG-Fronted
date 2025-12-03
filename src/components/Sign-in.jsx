import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import "./Sign-In.css";
import GoogleLogo from "../assets/google.png";

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Google OAuth token in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      Cookies.set('token', token, { expires: 1 }); // 1 day
      toast.success('Logged in successfully');

      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Navigate after a tiny delay so Header has time to read cookie
      setTimeout(() => navigate('/'), 50);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resp = await fetch(`https://back-project-olive.vercel.app/auth/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await resp.json();

      if (resp.status === 200) {
        Cookies.set('token', data, { expires: 1 });
        toast.success('Logged in successfully');
        navigate('/');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-wrapper">
      <div className='container'>
        <h1 className='tag'>Sign-in</h1>

        <form onSubmit={handleSubmit} className='frm'>
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
          <button className='btn2'>{loading ? 'Loading...' : 'Sign-in'}</button>
        </form>

        <a
          href="https://back-project-olive.vercel.app/auth/google"
          className="google-btn"
        >
          <img src={GoogleLogo} alt="Google Logo" className="google-logo" />
          <span>Continue with Google</span>
        </a>

        <h2 className='sign'>
          Don't have an account? <Link to={'/SignUp'}>Sign-up</Link>
        </h2>
      </div>
    </div>
  );
}
