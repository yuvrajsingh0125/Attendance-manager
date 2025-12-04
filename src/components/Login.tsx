// src/components/Login.tsx
import React, { useState, FormEvent } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase'; 

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Use FormEvent type for event handler
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); 
    
    if (!email || !password) {
        setError('Please enter both email and password.');
        return;
    }
    
    try {
      // signInWithEmailAndPassword handles its own types internally
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful!");
    } catch (err: any) { // Type the caught error
      // Firebase errors typically have a code and message
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* ... JSX inputs as before, with explicit types on onChange events ... */}
      <h2>Admin Login</h2>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} // e is automatically inferred as ChangeEvent<HTMLInputElement>
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit">Log In</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default Login;