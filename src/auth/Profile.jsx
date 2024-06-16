import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button'; // Adjust the import path as necessary
import EditProfileForm from '../components/EditProfile'; // Adjust the import path as necessary

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      navigate('/login');
    }
  }, [auth, navigate]);

  if (!user) return null;

  const handleEditProfile = () => {
    setEditMode(true);
  };

  return (
    <div className="flex flex-col items-center mt-8">
      {editMode ? (
        <EditProfileForm />
      ) : (
        <>
          <img
            src={user.photoURL || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="rounded-full w-32 h-32 mb-4"
          />
          <h1 className="text-2xl font-bold mb-2">{user.displayName || 'No Name'}</h1>
          <p className="text-lg mb-4">{user.email}</p>
          <Button
            type="primary"
            className="bg-blue-500 text-white"
            onClick={handleEditProfile}
          >
            Edit Profile
          </Button>
          <Button
            type="primary"
            className="bg-blue-500 text-white ml-2"
            onClick={() => navigate('/home')}
          >
            Back to Home
          </Button>
        </>
      )}
    </div>
  );
};

export default Profile;
