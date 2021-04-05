import firebase from "firebase/app"
import "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCLFCmZhTjBNyCRaTA77dc4RFn8Ieml8JM",
  authDomain: "twuuter-8cbfa.firebaseapp.com",
  projectId: "twuuter-8cbfa",
  storageBucket: "twuuter-8cbfa.appspot.com",
  messagingSenderId: "600793007982",
  appId: "1:600793007982:web:a232c71e99307eb4b8237f"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)


let db = firebase.firestore()

export default db 