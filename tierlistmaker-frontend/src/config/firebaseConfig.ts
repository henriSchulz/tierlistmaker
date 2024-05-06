import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getStorage} from "firebase/storage";
import {getFirestore} from "@firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyC4U53YTFbVtLb_zMBzf4MpTVMTx9p9_I8",
    authDomain: "tierlistmaker.org",
    projectId: "sandbox-655bf",
    storageBucket: "sandbox-655bf.appspot.com",
    messagingSenderId: "666195911026",
    appId: "1:666195911026:web:974744ed21487f38ae7deb",
    measurementId: "G-FW347XQTXB"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const storage = getStorage(app)
const firestore = getFirestore(app);


const provider = new GoogleAuthProvider();



export {auth, provider, storage, firestore}