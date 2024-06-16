import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const EditProfileForm = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const storage = getStorage();
  const user = auth.currentUser;

  const [username, setUsername] = useState(user.displayName || '');
  const [email] = useState(user.email || ''); // Uneditable email
  const [profilePic, setProfilePic] = useState(user.photoURL || '');
  const [uploading, setUploading] = useState(false);

  const handleSaveChanges = async () => {
    try {
      await updateProfile(user, {
        displayName: username,
        photoURL: profilePic,
      });
      navigate('/home');
    } catch (error) {
      console.error('Error updating profile: ', error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      const storageRef = ref(storage, `profile_images/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL: imageUrl });
      setProfilePic(imageUrl); // Update the local state
      setUploading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result);
      };
      reader.readAsDataURL(file);
      handleImageUpload(event);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-100 dark:bg-zinc-900">
      <div className="bg-white dark:bg-zinc-800 shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Edit profile</h2>
        <div className="flex justify-center mb-6">
          <div className="circle relative">
            <img
              className="profile-pic w-24 h-24 rounded-full object-cover"
              src={profilePic || 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'}
              alt="Profile Picture"
            />
            <div className="p-image">
              <i className="fa fa-camera upload-button cursor-pointer"></i>
              <input
                className="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
              />
            </div>
          </div>
        </div>
        <form>
          <div className="mb-4">
            <label htmlFor="username" className="block text-zinc-700 dark:text-zinc-300 text-sm font-bold mb-2">
              USER NAME
            </label>
            <input
              id="username"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 dark:text-zinc-300 leading-tight focus:outline-none focus:shadow-outline"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-zinc-700 dark:text-zinc-300 text-sm font-bold mb-2">
              E-MAIL ID
            </label>
            <input
              id="email"
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 dark:text-zinc-300 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              readOnly
            />
          </div>
          <button
            className="bg-blue-500 text-white p-2 rounded w-full text-zinc-700 dark:text-zinc-300 font-bold"
            type="button"
            onClick={handleSaveChanges}
            disabled={uploading}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;
