import { createContext, useState,useEffect } from "react";
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from "../config/firebase"; // Ensure firebase imports are correct
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [messagesId,setMessagesId]=useState(null);
    const [messages,setMessages]=useState([])
    const [chatUser,setChatUser]=useState(null)
    const [userSelected,setUserSelected]=useState(false);

    // Fixing the loadUserData function to work with context and state
    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data();
                setUserData(userData); 
                if (userData.avatar && userData.name) {
                    navigate('/chat');
                } else {
                    navigate('/profile');
                }
            } else {
                console.log('No such document!');
                navigate('/profile');  
            }

            // Update lastSeen and set an interval for subsequent updates
            await updateDoc(userRef, {
                lastSeen: Date.now()
            });

            setInterval(async () => {
                if (auth.chatUser) {
                    await updateDoc(userRef, {
                        lastSeen: Date.now()
                    });
                }
            }, 60000);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };
    
      useEffect(() => {
        if (userData) {
          const chatRef = doc(db, 'chats', userData.id);
          const unsub = onSnapshot(chatRef, async (res) => {
            const chatItems = res.data().chatsData || [];
          
            
            const tempData = [];
            for (const item of chatItems) {
              const userRef = doc(db, 'users', item.rId);
              const userSnap = await getDoc(userRef);
              const userData = userSnap.data();
              tempData.push({ ...item, userData });
            }
            console.log(tempData)
           setChatData(tempData.sort((a,b)=>b.updateAt - a.updateAt))
          });
    
          return () => {
            unsub();
          };
        }
      }, [userData]);

    const value = {
        userData,
        setUserData,
        chatData,
        setChatData,
        loadUserData,
        messages,setMessages,
        messagesId,setMessagesId,
        chatUser,setChatUser,
        userSelected,setUserSelected
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;
