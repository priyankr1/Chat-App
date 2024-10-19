import React, { useContext, useEffect,useState } from 'react';
import assets from '../../assets/assets/assets';
import './RightSidebar.css'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { logout } from '../../config/firebase';
import { AppContext } from '../../context/AppContext';

const RightSidebar = () => {
  const {chatUser,messages}=useContext(AppContext)
  const [msgImages,setMsgImages]=useState([])
  useEffect(()=>{
    let tempVar=[];
    console.log(messages)
    messages.map((msg)=>{
      if(msg.image){
        tempVar.push(msg.image)
      }
    })
   setMsgImages(tempVar)
  },[messages])
  return chatUser?(
      <Box className='rs'>
        <Box className="rs-profile">
          <img className='prof-img' src={chatUser.userData.avatar} alt="" />
          <h3>{chatUser.userData.name}{Date.now() - chatUser.userData.lastSeen<=70000?<img className='dot' src={assets.green_dot} alt="" />:null} </h3>
          <p>{chatUser.userData.bio}</p>
        </Box>
        <hr />
        <Box className='rs-media'>
          <p>Media</p>
          <Box>
            {
              msgImages.map((url,index)=>(<img onClick={()=>window.open(url)} key={index} src={url} alt="" />)) }
            {/* <img src={assets.pic1} alt="" />
            <img src={assets.pic2} alt="" />
            <img src={assets.pic3} alt="" />
            <img src={assets.pic4} alt="" />
            <img src={assets.pic5} alt="" />
            <img src={assets.pic6} alt="" /> */}
          </Box>
        </Box>
        <Button onClick={()=>logout()} variant="contained">Logout</Button>
        </Box>
  ):(
  <div className='rs'>
    <Button onClick={()=>logout()} variant="contained">Logout</Button>
  </div>
  )
}

export default RightSidebar;
