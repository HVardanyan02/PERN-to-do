import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import logo from '../to-do.webp';
import '../css/input_fields_style.css';

function Registration() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        navigate("/login"); // Redirect after successful registration
      } else {
        alert(data.error || "Failed to register user.");
      }
    } catch (err) {
      console.error("Error:", err.message);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="Register">
      <img src={logo} className="App-logo" alt="logo" />
      <h2>Get things done with TODO</h2>
      <h5>Let's help you meet your tasks</h5>
      <div className='input-fields'>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Enter your full name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Enter your email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Enter password" onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm password" onChange={handleChange} required />
          <Button url = "/to-do" submit={true}>Register</Button>
        </form>
      </div>
      <h5>
        Already have an account? <Link to="/login" className="sign-up-link">Sign In</Link>
      </h5>
    </div>
  );
}

export default Registration;
