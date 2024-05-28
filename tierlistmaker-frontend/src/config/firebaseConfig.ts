import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getStorage} from "firebase/storage";
import {getFirestore} from "@firebase/firestore";


const firebaseConfig = {
    //     FIREBASE CONFIGURATION
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const storage = getStorage(app)
const firestore = getFirestore(app);


const provider = new GoogleAuthProvider();


export {auth, provider, storage, firestore}