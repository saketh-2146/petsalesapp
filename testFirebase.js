import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAET75LK7xvjb0j2fWci76_wRcN2ombAA8",
  authDomain: "petsales-c8d4a9a7.firebaseapp.com",
  projectId: "petsales-c8d4a9a7",
  storageBucket: "petsales-c8d4a9a7.firebasestorage.app",
  messagingSenderId: "182059317045",
  appId: "1:182059317045:web:eef97f94bfa8be03623e7c"
};

async function testConnection() {
  console.log("Initializing Firebase...");
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log("Firebase App initialized. Attempting to fetch from Firestore...");
    
    // We try to fetch just 1 document from 'pets' collection to see if the connection is allowed
    const q = query(collection(db, "pets"), limit(1));
    const snapshot = await getDocs(q);
    
    console.log("✅ SUCCESS! Connected to Firebase project: " + firebaseConfig.projectId);
    console.log(`Found ${snapshot.size} documents in the 'pets' collection.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ FAILED to connect to Firebase.");
    console.error(error.message);
    process.exit(1);
  }
}

testConnection();
