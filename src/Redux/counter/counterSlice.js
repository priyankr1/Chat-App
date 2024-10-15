import { createSlice } from '@reduxjs/toolkit';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';


const initialState = {
    userData:null,
    chatData:null,
};
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setChatData: (state, action) => {
            state.chatData = action.payload;
        }
    }
});

export const loadUserData = (uid, navigator) => async (dispatch) => {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            dispatch(setUserData(userData)); 
            if (userData.avatar && userData.name) {
                navigator('/chat');
            } else {
                navigator('/profile');  
            }
        } else {
            console.log('No such document!');
            navigator('/profile');  
        }
        await updateDoc(userRef,{
            lastSeen:Date.now()
        })
        setInterval(async()=>{
                if(auth.chatUser){
                    await updateDoc(userRef,{
                        lastSeen:Date.now()
                    }) 
                }
        },60000)
    } catch (error) {
        console.log('Error loading user data:', error);
    }
   
};
export const { setUserData,setChatData,userData,chatData } = userSlice.actions;

export default userSlice.reducer;
