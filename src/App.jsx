import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'

function App() {


  const [books, setBooks] = useState([])
  const [bookTitle, setBookTitle] = useState()
  const [lancamento, setLancamento] = useState()
  const [newData, setNewData] = useState("")

  useEffect(() => {
    fecthBooks()
  }, [])

  const fecthBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/")
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      console.log(error)
    }
  }

  const addBook = async () => {
    const bookData = {
      bookTitle,
      Lancamento: lancamento
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/create", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      const data = await response.json()
      setBooks((prev) => [...prev, data])
    } catch (error) {
      console.log(error)
    }
  }

  const updateData = async (pk, lancamento) => {
    const bookData = {
      bookTitle: newData,
      Lancamento: lancamento
    };
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      const data = await response.json()
      setBooks((prev) => prev.map((book) => {
        if (book.id === pk) {
          return data
        } else {
          return book
        }
      }))
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBook = async (pk) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}`, {
        method: 'DELETE',
      });
      await response.json()
      setBooks((prev) => prev.filter(book => book.id !== pk))
    } catch (error) {
      console.log(error)
    }
    window.location.reload()

  }

  return (
    <>
      <h1>livros</h1>
      <div>
        <input type='text' placeholder='Titulo do livro...' onChange={(e) => setBookTitle(e.target.value)}></input>
        <input type='number' placeholder='Ano de Lançamento' onChange={(e) => setLancamento(e.target.value)}></input>
        <button onClick={addBook}>adicionar livro</button>
        {books.map((book) => (
          <>
            <div>
              <p>Titulo:{book.bookTitle}</p>
              <p>Lançamento:{book.Lancamento}</p>

              <input type='text' placeholder='alterar titulo...' onChange={(e) => setNewData(e.target.value)} />
              <button onClick={() => updateData(book.id, book.Lancamento)}>Alterar Titulo</button>
              <button onClick={() => deleteBook(book.id)}>Apagar</button>
            </div>
          </>
        ))}
      </div>
    </>
  )
}

export default App
