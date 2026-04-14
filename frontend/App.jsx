import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/phonebook'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([ ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [succeedMessage, setSucceedMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const Button = (event) => {
    event.preventDefault()
    if (persons.map(person => person.name).includes(newName) && persons.map(person => person.number).includes(newNumber)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    if (persons.map(person => person.name).includes(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newName)
        const changedPerson = { ...person, number: newNumber }
        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
          })
          .then(returnedPerson => {
            setSucceedMessage(`Changed ${newName}'s number successfully`)
            setTimeout(() => {
              setSucceedMessage(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(
              `Information of ${newName} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(p => p.id !== person.id))
          })
      }
      return
    }

    const newObject = {
      name: newName,
      number: newNumber
    }
    
    personService
      .create(newObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
      })
      .then(returnedPerson => {
        setSucceedMessage(`Added ${newName} successfully`)
        setTimeout(() => {
          setSucceedMessage(null)
        }, 5000)
      })
      .catch(error => {
        alert(
          `${newName} was already removed from server`
        )
        setPersons(persons.filter(p => p.id !== newObject.id))
      })
    setNewName('')
    setNewNumber('')
  }

  const AddNewName = (event) => {
    setNewName(event.target.value)
    console.log(newName)
  }

  const AddNewNumber = (event) => {
    setNewNumber(event.target.value)
    console.log(newNumber)
  }

  const [filter, setFilter] = useState('')
  const SetFilter = (event) => {
    setFilter(event.target.value)
    console.log(filter)
  }

  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  const deletePhoneBook = (id) => {
    if (window.confirm('Delete this person?')) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>

      <Notification message={succeedMessage} errorMessage={errorMessage} />

      <Filter filter={filter} setFilter={SetFilter}/>

      <h3>add a new</h3>

      <PersonForm addPerson={Button} newName={newName} newNumber={newNumber} handleNameChange={AddNewName} handleNumberChange={AddNewNumber}/>

      <h3>Numbers</h3>

      <Numbers personsToShow={personsToShow} deletePhoneBook={deletePhoneBook}/>
    </div>
  )
}

const Filter = ({ filter, setFilter }) => {
  return (
    <div>
      filter shown with: <input value={filter} onChange={setFilter}/>
    </div>
  )
}

const PersonForm = ({ addPerson, newName, newNumber, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const Numbers = ({ personsToShow, deletePhoneBook }) => {
  return (
    personsToShow.map(person => (
      <p
      key={person.name}>{person.name} {person.number}
      <button onClick={() => deletePhoneBook(person.id)}>delete</button>
      </p>
    ))
  )
}

export default App