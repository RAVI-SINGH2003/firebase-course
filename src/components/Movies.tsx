import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { auth, db, storage } from '../config/firebase'

const moviesCollectionRef = collection(db, 'movies')

interface IMovie {
  title: string
  releaseDate: number | undefined
  hasReceivedOscar: boolean
  id?: string
}

const Movies = () => {
  const [movieData, setMovieData] = useState<IMovie>({
    title: '',
    releaseDate: undefined,
    hasReceivedOscar: false,
  })
  const [movies, setMovies] = useState<Array<IMovie>>([])

  const [file, setFile] = useState(null)

  const [updatedTitle, setUpdatedTitle] = useState('')

  const handleMovieDelete = (id: string) => async () => {
    const movieDoc = doc(db, 'movies', id)
    await deleteDoc(movieDoc)
    setMovies(movies.filter(movie => movie.id !== id))
  }

  const handleMovieTitleUpdate = (id: string) => async () => {
    const movieDoc = doc(db, 'movies', id)
    await updateDoc(movieDoc, {
      title: updatedTitle,
    })
    setMovies(
      movies.map(movie => {
        if (movie.id === id) {
          return { ...movie, title: updatedTitle }
        }
        return movie
      }),
    )
  }

  const addMovie = async () => {
    try {
      const data = await addDoc(moviesCollectionRef, {
        ...movieData,
        userId: auth?.currentUser?.uid,
      })
      console.log('movie added', { data })
      getMovies()
    } catch (err) {
      console.error(err)
    }
  }

  const getMovies = async () => {
    try {
      const data = await getDocs(moviesCollectionRef)
      const filteredData = data.docs.map(doc => {
        return { ...doc.data(), id: doc.id }
      }) as IMovie[]
      setMovies(filteredData)

      console.log('movies fetched', { data })
    } catch (error) {
      console.error(error)
    }
  }

  const handleFileUpload = async () => {
    if (!file) return
    try {
      const filesFolderRef = ref(storage, `files/${file.name}`)
      await uploadBytes(filesFolderRef, file)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getMovies()
  }, [])

  return (
    <div>
      <label htmlFor="upload">Select File :</label>
      <input type="file" id="upload" onChange={e => setFile(e.target.files![0])} />
      <button onClick={handleFileUpload}>Upload File</button> <br /> <br /> <hr />
      <input
        type="text"
        value={movieData.title}
        onChange={e => setMovieData({ ...movieData, title: e.target.value })}
      />
      <input
        type="number"
        value={movieData.releaseDate!}
        onChange={e => setMovieData({ ...movieData, releaseDate: +e.target.value })}
      />
      <input
        type="checkbox"
        checked={movieData.hasReceivedOscar}
        onChange={e => setMovieData({ ...movieData, hasReceivedOscar: e.target.checked })}
      />
      <button onClick={addMovie}>Add Movie</button>
      <div>
        {movies.map(movie => {
          return (
            <div key={movie.id}>
              <p style={{ color: movie.hasReceivedOscar ? 'green' : 'red' }}>{movie.title}</p>
              <p>{movie.releaseDate}</p>
              <button onClick={handleMovieDelete(movie.id!)}>Delete</button>
              <input
                type="text"
                value={updatedTitle}
                onChange={e => setUpdatedTitle(e.target.value)}
              />
              <button onClick={handleMovieTitleUpdate(movie.id!)}>Update Title</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Movies
