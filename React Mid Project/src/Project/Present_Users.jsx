import React, { useState, useEffect } from 'react'

const Present_Users = ({ users, todos, updateUserData, deleteUser, userIdTodoPost, updateUserIdTodoPost, setAddNewUser }) => {

  const [userData, setUserData] = useState([])  // State to manage user data and ensure local updates are independent of parent data.
  const [searchInput, setSearchInput] = useState('')   // State to store the search input value.
  const [otherDataUserIds, setOtherDataUserIds] = useState([])   // State to track which users' "Other Data" is currently visible.

  // Initialize userData with users passed from props and structure the data appropriately.
  useEffect(() => {
    const newUserData = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      color: user.color,
      address: {
        street: user.address?.street,
        city: user.address?.city,
        zipcode: user.address?.zipcode
      }
    }));
    setUserData(newUserData)
  }, [users])

  // Update user colors based on whether they have incomplete todos.
  useEffect(() => {
    userData.forEach((user) => {
      const userTodos = todos.filter((todo) => todo.userId === user.id);

      // Check if any of the user's todos are incomplete.
      const hasIncompleteTodos = userTodos.some((todo) => !todo.completed);
      const usercolor = hasIncompleteTodos ? "red" : "green"

      // Update the color in the userData state.
      setUserData((pervData) => pervData.map((userToUpdate) =>
        userToUpdate.id == user.id ? { ...userToUpdate, color: usercolor } : userToUpdate
      ))
    })
  }, [todos])

  /**
   *  Handle changes in input fields for both user details and address.
   * @param {*} e User input
   * @param {*} id User ID
   */
  const handleChangeData = (e, id) => {
    const { name, value } = e.target;
    if (name == 'name' || name == 'email') {

      // Update basic user details.
      setUserData((pervData) => pervData.map((user) =>
        user.id == id ? { ...user, [name]: value } : user
      ))
    } else {

      // Update nested address fields.
      setUserData((pervData) => pervData.map((user) =>
        user.id == id ? { ...user, address: { ...user.address, [name]: value } } : user
      ))
    }
  }

  /**
   * Expand "Other Data" for a specific user.
   * @param {*} userId User ID
   */
  const handleOtherData = (userId) => {
    if (!otherDataUserIds.includes(userId)) {
      setOtherDataUserIds((prev) => [...prev, userId])
    }
  }

  /**
   * Collapse "Other Data" (address) for a specific user
   * @param {*} userId User ID
   */
  const handleClickOtherData = (userId) => {
    const otherDataIds = otherDataUserIds.filter((id) => id != userId)
    setOtherDataUserIds(otherDataIds)
  }

  /**
   * Toggle visibility of todos and posts for the selected user.
   * @param {*} userId User ID
   */
  const handleShowTodoPost = (userId) => {
    if (userIdTodoPost == userId) {
      updateUserIdTodoPost(0) // Close the view if the same user is clicked.
    } else {
      updateUserIdTodoPost(userId)  // Open the view for the clicked user.
    }
  }

  /**
   * Update the state to present add a new user div.
   */
  const handleAddUser = () => {
    if (userIdTodoPost > 0) {
      updateUserIdTodoPost(0)
    }
    setAddNewUser(true)
  }

  return (
    <div style={{ width: "500px" }}>

      {/* Search bar and "Add User" button */}
      <strong>Search :   </strong> <input type="text" onChange={(e) => setSearchInput(e.target.value)} />
      <button style={{ marginLeft: "30px", backgroundColor: 'yellowgreen' }} onClick={handleAddUser}>Add</button> <br />

      {/* Filter and render the user list based on search input */}
      {
        userData.filter(user => user.name.includes(searchInput) || user.email.includes(searchInput)).map((user) => {
          return <div key={user.id} style={{ border: `2px solid ${user.color ? user.color : "black"}`, marginBottom: "10px", backgroundColor: userIdTodoPost == user.id ? 'orange' : '' }}>

             {/* Display user details */}
            <h3 onClick={() => handleShowTodoPost(user.id)}>ID : {user.id}</h3>
            <h3>Name : <input type="text" value={user.name} name='name' onChange={(e) => handleChangeData(e, user.id)} /></h3>
            <h3>Email : <input type="text" value={user.email} name='email' onChange={(e) => handleChangeData(e, user.id)} /></h3>

            {/* Button to toggle additional user data */}
            <button style={{ marginLeft: "20px", backgroundColor: 'gray' }} onMouseOver={() => handleOtherData(user.id)} onClick={() => handleClickOtherData(user.id)}>Other Data</button>

            {/* Render additional data if expanded */}
            {
              otherDataUserIds.includes(user.id) && (
                <div>
                  <h3>Street : <input type="text" name='street' value={user.address?.street} onChange={(e) => handleChangeData(e, user.id)} /></h3>
                  <h3>City : <input type="text" name='city' value={user.address?.city} onChange={(e) => handleChangeData(e, user.id)} /></h3>
                  <h3>Zip Code : <input type="text" name='zipcode' value={user.address?.zipcode} onChange={(e) => handleChangeData(e, user.id)} /></h3>
                </div>
              )
            }

             {/* Update and Delete buttons */}
            <button style={{ marginLeft: "30px", marginBottom: "5px", backgroundColor: 'yellowgreen' }} onClick={() => updateUserData(user)}>Update</button>
            <button style={{ marginLeft: "10px", backgroundColor: 'yellowgreen' }} onClick={() => deleteUser({ id: user.id })}  >Delete</button>
          </div>
        })
      }
    </div>
  )
}

export default Present_Users