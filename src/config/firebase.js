// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { doc } from "firebase/firestore";

import { ToastContainer, toast } from 'react-toastify';
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth =getAuth(app)
const db=getFirestore(app)


const signup= async(username,email,password)=>{
    try {
      const res = await createUserWithEmailAndPassword(auth,email,password);
      const user=res.user;
       await setDoc(doc(db,'users',user.uid),{
        id:user.uid,
        username:username.toLowerCase(),
        email,
        name:'',
        avatar:'',
        bio:"Hey ,There i am using chat-app",
        lastSeen:Date.now()
       })
       await setDoc(doc(db,"chats",user.uid),{
        chatsData:[],
       })
    } catch (error) {
      console.log(error)
      toast.error(error.code.split('/')[1].split('-').join(' '))
    }
}
const login= async(email,password)=>{
  try {
    await signInWithEmailAndPassword(auth,email,password);
  } catch (error) {
    console.log(error)
      toast.error(error.code.split('/')[1].split('-').join(' '))
  }
}
const logout= async ()=>{
  try {
    await signOut(auth)
  } catch (error) {
    console.log(error)
    toast.error(error.code.split('/')[1].split('-').join(' '))
  }
  
}
const resetPass= async(email)=>{
  if(!email){
    toast.error("Enter your email")
    return null;
  }
  try {
    const userRef=collection(db,'users')
    const q=query(userRef,where("email","==",email))
    const querySnap=await getDocs(q);
    if(!querySnap.empty){
      await sendPasswordResetEmail(auth,email);
      toast.success("Reset Email Sent")
    }else{
      toast.error("Email dosen't exists")
    }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
}
export {signup,login,logout,auth,db,resetPass}
