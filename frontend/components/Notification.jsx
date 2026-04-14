const Notification = ({ message, errorMessage }) => {
  if (message === null && errorMessage === null) {
    return null
  }

  if (errorMessage !== null) {
    return (
      <div className='error'>
        {errorMessage}
      </div>
    )
  }

  return (
    <div className='success'>
      {message}
    </div>
  )
}

export default Notification