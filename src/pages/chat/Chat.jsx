import React, { useContext, useEffect, useState } from 'react';
import './Chat.css'
import LeftSidebar from '../../components/leftsidebar/LeftSidebar';
import ChatBox from '../../components/chatbox/ChatBox';
import RightSidebar from '../../components/rightsidebar/RightSidebar';
import Box from '@mui/material/Box';
import { AppContext } from '../../context/AppContext';
const Chat = () => {
  const { chatData, userData, userSelected } = useContext(AppContext)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);

  const [loading, setLoading] = useState(true)

  useEffect(() => {


    // Function to handle screen resize
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [window]);

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false)
    }
  }, [chatData, userData]);
  return (
    <Box className='chat'>
      {
        loading
          ? <p className='loading'>Loading....</p> :
          <Box className="chat-container">

            {(!isMobile || !userSelected) && <LeftSidebar />}
        {(!isMobile || userSelected)&&<ChatBox />}
            <RightSidebar />
          </Box>
      }

    </Box>
  );
}

export default Chat;
