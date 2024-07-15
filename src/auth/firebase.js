import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZHfHbdRILuAqhbv7pjAJNNMJzZWI4hhc",
  authDomain: "powellinspection.firebaseapp.com",
  projectId: "powellinspection",
  storageBucket: "powellinspection.appspot.com",
  messagingSenderId: "868353797491",
  appId: "1:868353797491:web:31e4ceba87288439b1e906",
  measurementId: "G-VVDGKDRPDV"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Use the already initialized app
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Add inspection form and upload file to Firebase Storage
const addInspectionForm = async (form, file) => {
  try {
    // Add form data to Firestore
    const docRef = await addDoc(collection(db, 'inspectionForms'), form);

    // Reference to the file in Firebase Storage
    const fileRef = ref(storage, `inspectionForms/${docRef.id}/${file.name}`);

    // Upload file to Firebase Storage
    await uploadBytes(fileRef, file);

    // Get the download URL for the uploaded file
    const fileURL = await getDownloadURL(fileRef);

    // Update Firestore document with the file URL
    await updateDoc(doc(db, 'inspectionForms', docRef.id), { fileURL });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Get all inspection forms from Firestore
const getInspectionForms = async () => {
  const querySnapshot = await getDocs(collection(db, 'inspectionForms'));
  const forms = [];
  querySnapshot.forEach((doc) => {
    forms.push({ id: doc.id, ...doc.data() });
  });
  return forms;
};

// Update an inspection form in Firestore
const updateInspectionForm = async (id, updatedForm) => {
  const formDoc = doc(db, 'inspectionForms', id);
  await updateDoc(formDoc, updatedForm);
};

// Delete an inspection form from Firestore
const deleteInspectionForm = async (id) => {
  const formDoc = doc(db, 'inspectionForms', id);
  await deleteDoc(formDoc);
};

export { auth, db, storage, addInspectionForm, getInspectionForms, updateInspectionForm, deleteInspectionForm };
