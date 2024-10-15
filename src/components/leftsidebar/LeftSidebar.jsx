import React, { useContext, useState } from 'react';
import './LeftSidebar.css';
import assets from '../../assets/assets/assets';
import { useNavigate } from 'react-router-dom';
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { userData, chatData, chatUser, setChatUser, setMessagesId, messagesId } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, 'users');
        const q = query(userRef, where('username', "==", input.toLowerCase()));
        const querySnap = await getDocs(q);

        // Log the retrieved documents


        if (!querySnap.empty && querySnap.docs[0].id !== userData.id) {
          let userExits = false;
          chatData.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExits = true;
            }
          })
          if (!userExits) {
            setUser(querySnap.docs[0].data());
          }

        } else {
          console.log('No matching documents found or searching for yourself.');
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };


  const addChat = async () => {

    const messageRef = collection(db, 'message');
    const chatsRef = collection(db, 'chats');
    try {
      const newMessageRef = doc(messageRef);
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: []
      });
      console.log(chatsRef, user.id);
      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messagesId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      });

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messagesId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      });
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };
  const setChat = async (item) => {
    try {
      setMessagesId(item.messagesId);
      setChatUser(item)
      const userChatsRef = doc(db, 'chats', userData.id);
      const userChatsSnapShot = await getDoc(userChatsRef)
      const userChatsData = userChatsSnapShot.data();
      const chatIndex = userChatsData.chatsData.findIndex((c) => c.messageId === item.messageId)
      userChatsData.chatData[chatIndex].messageSeen = true;
      await updateDoc(userChatsRef, {
        chatData: userChatsData.chatsData
      })
    } catch (error) {
      console.log(error)
      toast.error(error)
    }

  }
  console.log(chatData)
  return (
    <div className='ls'>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className='logo' />
          <div className="menu">
            <img src={assets.menu_icon} />
            <div className='sub-menu'>
              <p onClick={() => navigate('/profile')}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} />
          <input onChange={inputHandler} type="search" placeholder='Search here....' />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user ? (
          <div onClick={addChat} className='friends add-user'>
            <img src={user.avatar} alt="" />
            <p>{user.name}</p>
          </div>
        ) : chatData?.map((item, index) => (
          <div onClick={() => { setChat(item); }} key={index} className={`friends ${item.messageSeen || item.messagesId ? '' : 'border'}`} >

            <img src={item?.userData?.avatar} alt="" />
            <div>
              <p>{item?.userData?.name}</p>
              <span>{item?.lastMessage}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeftSidebar;

