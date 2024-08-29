import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'

function App() {


  const [books, setBooks] = useState([])
  const [bookTitle, setBookTitle] = useState()
  const [lancamento, setLancamento] = useState()
  const [newData, setNewData] = useState("")
  const [edit, setEdit] = useState(false)
  const [editBookId, setEditBookId] = useState(null);

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
    setBookTitle('')
    setLancamento('')
  }

  const showEdit = (pk, tituloAtual) => {
    setEdit(true)
    setEditBookId(pk)
    setNewData(tituloAtual)
  }

  const updateData = async (pk, lancamento) => {
    setEdit(true)
    setEditBookId(pk)
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
      setEdit(false)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBook = async (pk) => {
    window.alert('deseja apagar a linha?')
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
    <div>
      <div className='titulo'>
        <p>livros</p>
      </div>

      <div className='adicionar'>
        <span>Adicione novos livros</span>
        <input type='text' placeholder='Titulo do livro...' onChange={(e) => setBookTitle(e.target.value)}></input>
        <input type='year' min="1900" max="2024" placeholder='Ano de Lançamento' onChange={(e) => setLancamento(e.target.value)}></input>
        <button className='styled-button' onClick={addBook}>adicionar livro</button>
      </div>

      <div className="table-container">
        <table className="responsive-table">

          <thead>
            <tr>
              <th>Nome do livro</th>
              <th>Ano de lançamento</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <>
                <tr key={book.id}>
                  <td key={book.id}>{
                    edit && editBookId == book.id ? (

                      <input onChange={(e) => setNewData(e.target.value)} value={newData}></input>

                    ) : (
                      book.bookTitle
                    )
                  }
                  </td>
                  <td>{book.Lancamento}</td>
                  <td>


                    <button className="delete-btn" onClick={() => deleteBook(book.id)}>Apagar</button>
                    {
                      !edit ? (
                        <>
                          <button className="edit-btn" onClick={() => showEdit(book.id, book.bookTitle)}>Editar</button>
                        </>
                      ) : (
                        <>
                          <button className="edit-btn" onClick={() => updateData(book.id, book.Lancamento)}>Confirma alteração</button>
                        </>
                      )
                    }

                  </td>
                </tr>
              </>
            ))}
          </tbody>

        </table>
      </div>



    </div>
  )
}

export default App
