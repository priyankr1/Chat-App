import React, { useState } from 'react';
import Button from '@mui/material/Button';
import './Login.css'
import assets from '../../assets/assets/assets';
import Box from '@mui/material/Box';
import { signup ,login} from '../../config/firebase';

const Login = () => {
    const[currState,setCurrState]=useState('Sign up')
    const[userName,setUserName]=useState('')
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('')

    const onSubmitHandler=(event)=>{
        event.preventDefault();
        if(currState==='Sign up'){
          signup(userName,email,password)
        }
        else{
          login(email,password)
        }
    }
  return (
    <Box className='login'>
      <img src={assets.logo_big} className='logo' />
      <form onSubmit={onSubmitHandler} className='login-form'>
        <h2>{currState}</h2>
       {currState==='Sign up'?<input onChange={(e)=>setUserName(e.target.value)} value={userName} className='form-input' type="text"placeholder='User-Name' required/>:null} 
        <input onChange={(e)=>setEmail(e.target.value)} value={email} className='form-input' type="email" placeholder='Email' required />
        <input onChange={(e)=>setPassword(e.target.value)} value={password} className='form-input' type="password" placeholder='Password' required/>
        <Button type='submit' variant="contained">{currState==='Sign up'?'Creat account':'Login now'}</Button>
        <Box className='login-term'>
            <input type="checkbox" />
            <p>Agree to the terms to use & privacy policy </p>
        </Box>
        <Box className='login-forgot'>
            {
                currState==='Sign up'? <p className='login-toggle'>Already have an account <span onClick={()=>{setCurrState('Login')}}>Click here</span></p>:           
                <p className='login-toggle'>Create an account <span onClick={()=>{setCurrState('Sign up')}}>Click here</span></p>
            }

        </Box>
      </form>
    </Box>
  );
}

export default Login;
