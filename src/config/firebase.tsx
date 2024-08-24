import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAFL45Fx0a4oFFoUjdcEEhWJb5DS23LUIc',
  authDomain: 'todo-app-687ba.firebaseapp.com',
  projectId: 'todo-app-687ba',
  storageBucket: 'todo-app-687ba.appspot.com',
  messagingSenderId: '124398348725',
  appId: '1:124398348725:web:60764c56a9a13293d0d1fc',
  measurementId: 'G-NZSHPCKX0E',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
