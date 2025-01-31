import React, { useContext, useEffect, useState } from 'react';
import './ChatBox.css'
import assets from '../../assets/assets/assets';
import Box from '@mui/material/Box';
import { AppContext } from '../../context/AppContext';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';
import { useNavigate } from 'react-router-dom';
const ChatBox = () => {
  const navigate=useNavigate()
  const {userData,messagesId,chatUser,messages,setMessages,setUserSelected}=useContext(AppContext);
  const [input,setInput]=useState("");
  const sendMessage=async()=>{
    try {
      if(input && messagesId){
          await updateDoc(doc(db,'message',messagesId),{
            messages:arrayUnion({
              sId:userData.id,
              text:input,
              createdAt:new Date()
            })
          })
          const userIDs=[chatUser.rId,userData.id];
          userIDs.forEach(async (id) =>{
            const userChatsRef=doc(db,'chats',id)
            const userChatsSnapShot=await getDoc(userChatsRef);
            if (userChatsSnapShot.exists) {

              const userChatData= userChatsSnapShot.data();
              const chatIndex=userChatData.chatsData.findIndex((c)=>c.messagesId===messagesId)
              userChatData.chatsData[chatIndex].lastMessage=input.slice(0,30);
              userChatData.chatsData[chatIndex].updateAt=Date.now();
              if (userChatData.chatsData[chatIndex].rId===userData.id) {
                userChatData.chatsData[chatIndex].messageSeen=false;
              }
              await updateDoc(userChatsRef,{
                chatsData:userChatData.chatsData
              })

            } 
          })
      }
    } catch (error) {
      toast.error(error)
    }
    setInput('')
  }
  const sendImage=async(e)=>{
    try {
      const fileUrl=await upload(e.target.files[0]);
      if(fileUrl && messagesId){
        await updateDoc(doc(db,'message',messagesId),{
          messages:arrayUnion({
            sId:userData.id,
            image:fileUrl,
            createdAt:new Date()
          })
        })
        const userIDs=[chatUser.rId,userData.id];
        userIDs.forEach(async (id) =>{
          const userChatsRef=doc(db,'chats',id)
          const userChatsSnapShot=await getDoc(userChatsRef);
          if (userChatsSnapShot.exists) {

            const userChatData= userChatsSnapShot.data();
            const chatIndex=userChatData.chatsData.findIndex((c)=>c.messagesId===messagesId)
            userChatData.chatsData[chatIndex].lastMessage="image";
            userChatData.chatsData[chatIndex].updateAt=Date.now();
            if (userChatData.chatsData[chatIndex].rId===userData.id) {
              userChatData.chatsData[chatIndex].messageSeen=false;
            }
            await updateDoc(userChatsRef,{
              chatsData:userChatData.chatsData
            })

          } 
        })
      }
    } catch(error) {
      toast.error(error) 
    }
  }
  const covertTimestamp=(timestamp)=>{
    let date=timestamp.toDate();
    const hour=date.getHours();
    const minute=date.getMinutes();
    if(hour>12){
      return hour-12+':'+minute+"PM";
    }else{
      return hour-12+':'+minute+"AM";
    }
  }
  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, 'message', messagesId), (res) => {
        if (res.exists()) {
          const messageData = res.data().messages || [];  
          setMessages([...messageData].reverse());
        } else {
          // Document does not exist
          console.log('Document with messagesId does not exist.');
        }
      });
  
      return () => {
        unSub();
      };
    }
  }, [messagesId, chatUser, userData]);

  return chatUser?(
    <Box className='chat-box'>
      <Box className='chat-user'>
        <img src={chatUser.userData.avatar} alt="" />
        <p>{chatUser.userData.name}{Date.now()-chatUser.userData.lastSeen<=70000 ? <img className='dot' src={assets.green_dot} alt="" />:null}</p>
        <img src={assets.help_icon} alt="" className='help'/>
        <img onClick={()=>setUserSelected(false)} src={assets.arrow_icon} className='arrow' alt="" />
      </Box>

      <Box className="chat-msg">
        {messages.map((msg,index)=>(
                <Box key={index} className={msg.sId===userData.id ? 's-msg':'r-msg'}>
                  {msg["image"]
                  ?<img  className='msg-img' src={msg.image}/>
                :  <p className='msg'>{msg.text}</p>}
                <Box>
                  <img src={msg.sId===userData.id?userData.avatar:chatUser.userData.avatar} alt="" />
                  <p>{covertTimestamp(msg.createdAt)}</p>
                </Box>
              </Box>
        ))}
    
        
      </Box>
      <Box className="chat-input">
        <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Send a message' />
        <input onChange={sendImage} type="file" id='image' accept='image/png,image/jpeg' hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </Box>
    </Box>
  )
  :<div className='chat-welcome'>
    <img src={assets.logo_icon} alt="" />
    <p>Chat with ,Your friends</p>
  </div>
}

export default ChatBox;


