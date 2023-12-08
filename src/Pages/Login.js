import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom"
import { setUser } from './Redux/authSlice/authSlice'
import LOGO from '../assets/images/logo.png'
import Apple from '../assets/images/apple.svg'
import Facebook from '../assets/images/facebook.svg'
import Google from '../assets/images/google.svg'


const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const count = useSelector((state) => state.auth.user);
    const [UserName, setUserName] = useState(null);
    const [Password, setPassword] = useState(null);

    const onLogin = () => {
        // const res = dispatch(setUser({ name: 'Piyush', mobile: '8758260598' }));
        console.log(UserName, Password);
        navigate('/dashboard');
    };

    return (
        <div className='w-full flex justify-center h-screen items-center'>
            <div className='border rounded-[10px] max_sm:border-none bg-[#fbfbfb]'>
                <div className='m-[50px] w-[480px] flex flex-col justify-center
                        max_sm:w-[100%] max_sm:p-[20px] max_sm:m-[0px] 
                        max_720:m-[0px] max_720:p-[20px]'>
                    <div className='flex justify-center pb-[20px]'>
                        <img src={LOGO} className='w-[30%]' />
                    </div>
                    <div className='pb-[15px] flex flex-col text-[14px]'>
                        <label className='py-[10px] pb-1'>User name</label>
                        <input type='text' onChange={(e) => setUserName(e.target.value)} className='w-full h-[45px] border rounded px-[10px]' />
                    </div>
                    <div className='flex flex-col pb-[50px] text-[14px]'>
                        <label className='py-[10px] pb-1'>Password</label>
                        <input type='password' onChange={(e) => setPassword(e.target.value)} className='w-full h-[45px] border rounded px-[10px]' />
                    </div>
                    <button onClick={onLogin} className='w-full border h-[45px] rounded bg-[#C483FD] text-[#fff] font-[700]'>Login</button>
                    <div className='w-full flex justify-center items-center gap-3 py-5'>
                        <div className='border gradient-border w-[30%]'></div>
                        <div>OR</div>
                        <div className='border gradient-border w-[30%]'></div>
                    </div>
                    <div className='flex justify-center items-center gap-5'>
                        <img className='cursor-pointer' src={Google} />
                        <img className='cursor-pointer' src={Facebook} />
                        <img className='cursor-pointer' src={Apple} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login