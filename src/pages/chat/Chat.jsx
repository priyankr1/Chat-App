import React, { useContext, useEffect, useState } from 'react';
import './Chat.css'
import LeftSidebar from '../../components/leftsidebar/LeftSidebar';
import ChatBox from '../../components/chatbox/ChatBox';
import RightSidebar from '../../components/rightsidebar/RightSidebar';
import Box from '@mui/material/Box';
import { AppContext } from '../../context/AppContext';
const Chat = () => {
  const {chatData,userData}=useContext(AppContext)
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
      if(chatData && userData){
        setLoading(false)
      }
  },[chatData,userData])
  return (
    <Box className='chat'>
    {
        loading
        ?<p className='loading'>Loading....</p>: 
        <Box className="chat-container">
        <LeftSidebar/>
        <ChatBox/>
        <RightSidebar/>
    </Box>
    }
       
    </Box>
  );
}

export default Chat;
