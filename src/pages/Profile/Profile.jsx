import React, { useContext, useEffect, useState } from 'react';
import './Profile.css';
import assets from '../../assets/assets/assets';
import Button from '@mui/material/Button';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';
import { AppContext } from '../../context/AppContext';

const Profile = () => {
  const {setUserData}=useContext(AppContext) ;

  const navigate = useNavigate();
 
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");

  const ProfileUpdate = async (event) => {
    event.preventDefault();
    console.log(prevImage);
    try {
      if (!prevImage && !image) {
        toast.error("Upload Profile picture");
        return; // Exit early if no image
      }
      const docRef = doc(db, 'users', uid);
      if (image) {
        const imgUrl = await upload(image);
        setPrevImage(imgUrl);
        await updateDoc(docRef, {
          avatar: imgUrl,
          bio: bio,
          name: name // Fixed typo 'namw' to 'name'
        });
      } else {
        await updateDoc(docRef, {
          bio: bio,
          name: name 
        });
      }
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate('/chat');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
      onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) { 
          const data = docSnap.data();
          if(data.name){
            setName(data.name ); 
          }
          if(data.bio){
            setBio(data.bio ); 
          }
        if(data.avatar){
          setPrevImage(data.avatar || assets.avatar_icon); 
        }
        }
      } else {
        navigate('/');
      }
    });
  });

  return (
    <div className='profile'>
      <div className='profile-conatiner'>
        <form onSubmit={ProfileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='avatar' accept='.png,.jpg,.jpeg' hidden />
            <img src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.avatar_icon} alt="" />
            Upload Profile image
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Your name' required />
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} placeholder='Write profile bio'></textarea>
          <Button type='submit' variant="contained">Save</Button>
        </form>
        <img className='profile-pic' src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} alt="" />
      </div>
    </div>
  );
}

export default Profile;
