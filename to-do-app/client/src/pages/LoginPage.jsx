import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import logo from '../to-do.webp';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Login failed!");  // Show the error message returned by the server
        return;
      }
  
      const userData = await response.json();
      localStorage.setItem("user", JSON.stringify(userData));
  
      // Navigate to the tasks page after successful login
      navigate("/to-do");
    } catch (err) {
      console.error("Login error:", err.message);
      alert("An error occurred during login!");
    }
  };

  return (
    <div className="Login">
      <img src={logo} className="App-logo" alt="logo" />
      <>
        <h4>Welcome back <br /> to</h4> 
        <h3>OUR REMINDER</h3>
      </>
      <div className='input-fields'>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            name="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <br />
          <input 
            type="password" 
            name="password" 
            placeholder="Enter password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          
          <Button submit={true}>Sign In</Button>
        </form>
      </div>
      <h5>Forgot Password</h5>

      <h5>
        Don't have an account? <Link to="/registration" className="sign-in-link">Sign Up</Link>
      </h5>    
    </div>
  );
}

export default Login;
