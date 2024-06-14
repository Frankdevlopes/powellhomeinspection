import React, { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import sharedClasses from './sharedClasses'; // Import shared classes from a separate file or define them in this file

const EditProfile = () => {
  const auth = getAuth();
  const storage = getStorage();
  const db = getFirestore();
  const [profileImage, setProfileImage] = useState(auth.currentUser?.photoURL || 'https://placehold.co/100x100');
  const [username, setUsername] = useState(auth.currentUser?.displayName || '');
  const [email, setEmail] = useState(auth.currentUser?.email || '');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(auth.currentUser, { photoURL });
      setProfileImage(photoURL);
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userDoc, { photoURL }, { merge: true });
    }
  };

  const handleSave = async () => {
    if (username) {
      await updateProfile(auth.currentUser, { displayName: username });
    }
    const userDoc = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userDoc, { displayName: username, email }, { merge: true });
  };

  return (
    <div className={`flex justify-center items-center min-h-screen ${sharedClasses.bgZinc}`}>
      <div className={`${sharedClasses.bgWhite} ${sharedClasses.shadowMd} ${sharedClasses.rounded} ${sharedClasses.p8} ${sharedClasses.maxWmd} ${sharedClasses.wFull}`}>
        <h2 className={`${sharedClasses.text2xl} ${sharedClasses.fontBold} ${sharedClasses.textZinc} ${sharedClasses.mb6}`}>
          Edit Profile
        </h2>
        <div className={`${sharedClasses.flex} ${sharedClasses.justifyCenter} ${sharedClasses.mb6}`}>
          <div className="relative">
            <img className={`${sharedClasses.w24} ${sharedClasses.h24} ${sharedClasses.roundedFull} ${sharedClasses.objectCover}`} src={profileImage} alt="Profile Picture" />
            <input type="file" className={`${sharedClasses.absolute} ${sharedClasses.bottom0} ${sharedClasses.right0} ${sharedClasses.bgBlue} ${sharedClasses.textWhite} ${sharedClasses.p1} ${sharedClasses.roundedFull}`} onChange={handleImageUpload} />
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className={sharedClasses.mb4}>
            <label className={`${sharedClasses.block} ${sharedClasses.textZinc} text-sm font-bold mb-2`} htmlFor="username">USER NAME</label>
            <input className={`${sharedClasses.shadow} ${sharedClasses.appearanceNone} ${sharedClasses.border} ${sharedClasses.rounded} ${sharedClasses.wFull} ${sharedClasses.py2} ${sharedClasses.px3} ${sharedClasses.textZinc} ${sharedClasses.leadingTight} ${sharedClasses.focusOutline} ${sharedClasses.focusShadow}`} id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className={sharedClasses.mb4}>
            <label className={`${sharedClasses.block} ${sharedClasses.textZinc} text-sm font-bold mb-2`} htmlFor="email">E-MAIL ID</label>
            <input className={`${sharedClasses.shadow} ${sharedClasses.appearanceNone} ${sharedClasses.border} ${sharedClasses.rounded} ${sharedClasses.wFull} ${sharedClasses.py2} ${sharedClasses.px3} ${sharedClasses.textZinc} ${sharedClasses.leadingTight} ${sharedClasses.focusOutline} ${sharedClasses.focusShadow}`} id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button type="submit" className={`${sharedClasses.bgBlue} ${sharedClasses.textWhite} ${sharedClasses.px3} ${sharedClasses.py2} ${sharedClasses.rounded}`}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
