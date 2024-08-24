import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { useState } from 'react'
import { auth } from '../config/firebase'

const Auth = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  })

  const getUserToken = async () => {
    const token = await auth.currentUser?.getIdToken()
    console.log({ token })
  }

  const handleSignIn = async () => {
    const { email, password } = userData
    console.log(email, password)
    if (!email || !password) {
      alert('Please enter all details')
      return
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = await userCredential.user
      console.log({ user })
    } catch (err) {
      console.log('error while creating user', err)
    }
  }

  const handleSignupWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()

      const result = await signInWithPopup(auth, provider)

      const credential = GoogleAuthProvider.credentialFromResult(result)
      if (!credential) {
        console.error('Error in user Credential')
        return
      }
      const token = credential.accessToken
      const user = result.user
      console.log(user, token)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSignout = async () => {
    await signOut(auth)
  }

  return (
    <div>
      <input
        type="email"
        placeholder="Enter your email"
        value={userData.email}
        onChange={e => setUserData({ ...userData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={userData.password}
        onChange={e => setUserData({ ...userData, password: e.target.value })}
      />
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleSignupWithGoogle}>Sign In with Google</button>
      <button onClick={handleSignout}>Signout</button>
      <button onClick={getUserToken}>Get User Token</button>
    </div>
  )
}

export default Auth
