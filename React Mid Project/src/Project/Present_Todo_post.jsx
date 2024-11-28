import React, { useState, useEffect } from 'react'

const Present_Todo_post = ({ userId, todos, posts, markTodoComplete, addNewTodo, addNewpost, addNewUser, setAddNewUser, addUserWithData }) => {

  const [newTodo, setNewTodo] = useState(false)
  const [newPost, setNewPost] = useState(false)
  const [newTodoTitle, setNewTodoTilte] = useState('')
  const [newPostData, setNewPostData] = useState({ title: "", body: "" })
  const [newUserData, setNewUserData] = useState({ name: "", email: "" })

  // Reset forms when `userId` changes
  useEffect(() => {
    handleClickCancelTodo()
    handleClickCancelPost()
    handleClickCancelUser()
  }, [userId])

  /**
   * Handles adding a new todo
   */
  const handleNewTodo = () => {
    if (newTodoTitle != '') { // Check if the input is valid
      addNewTodo(newTodoTitle)
      handleClickCancelTodo() // Clear input box
    } else {
      alert("Please enter a title") // if input not valid alert to the user
    }
  }

  /**
   * Handles adding a new post
   */
  const handleNewPost = () => {
    if (newPostData.title != '' && newPostData.body != '') {// Check if the input is valid
      addNewpost(newPostData)
      handleClickCancelPost() // Clear input box
    } else {
      alert("Please enter a title and body")  // if input not valid alert to the user
    }
  }


  /**
   * Handles adding a new user
   */
  const handleAddUser = () => {
    if (newUserData.name != '' && newUserData.email != '') {// Check if the input is valid
      addUserWithData(newUserData)
      handleClickCancelUser() // Clear input box
    } else {
      alert("Please enter a name and email")  // if input not valid alert to the user
    }
  }

  /**
   * Resets the "Add Todo" form
   */
  const handleClickCancelTodo = () => {
    setNewTodo(false)
    setNewTodoTilte('')
  }


  /**
   *  Resets the "Add User" form
   */
  const handleClickCancelUser = () => {
    setAddNewUser()
    setNewUserData({ name: "", email: "" })
  }

  /**
   * Resets the "Add Post" form
   */
  const handleClickCancelPost = () => {
    setNewPost(false)
    setNewPostData({ title: "", body: "" })
  }

  /**
   * Updates the new post data as the user types
   * @param {*} e user input
   */
  const handlePostData = (e) => {
    const { name, value } = e.target;
    setNewPostData({ ...newPostData, [name]: value })
  }

  /**
   * Updates the new user data as the user types
   * @param {*} e user input
   */
  const handleUserData = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value })
  }

  return (
    <div style={{ marginTop: "20px", marginLeft: "10%" }}>
      {userId > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "500px 500px" }}>

          {/* Todos Section */}
          <div>
            <h2 style={{ display: "inline-block" }}>{newTodo ? "New " : ''}Todos - user {userId}</h2>
            {!newTodo ? <button style={{ marginLeft: "40%", backgroundColor: 'yellowgreen' }} onClick={() => setNewTodo(true)} >Add</button> : null}
            {newTodo && (
              <div style={{ border: "2px solid black" }}>
                <h3 style={{ marginLeft: "25%" }}>Title : <input type="text" value={newTodoTitle} name='title' onChange={(e) => setNewTodoTilte(e.target.value)} /></h3>
                <button style={{ marginLeft: "55%", backgroundColor: 'yellowgreen' }} onClick={handleClickCancelTodo} >Cancel</button>
                <button style={{ marginLeft: "5%", backgroundColor: 'yellowgreen', marginBottom: "3%" }} onClick={handleNewTodo} >Add</button>
              </div>
            )}

            {!newTodo && (
              <div style={{ border: "2px solid black" }}>
                {
                  todos.filter((todo) => todo.userId == userId).map((todo) => {
                    return <div key={todo.id} style={{ border: "2px solid purple", width: "80%", marginLeft: "10%", marginTop: "10px" }}>
                      <h4>Title : {todo.title}</h4>
                      <h4 style={{ display: "inline-block" }}>Completed : {String(todo.completed)}</h4>
                      {!todo.completed ? <button style={{ backgroundColor: 'yellowgreen', marginLeft: "20%" }} onClick={() => markTodoComplete(todo.id)}>Mark Completed</button> : null}
                    </div>
                  })
                }
              </div>
            )}
          </div>

          {/* Posts Section */}
          <div style={{ marginLeft: "5%" }}>
            <h2 style={{ display: "inline-block" }}>{newPost ? "New " : ''}Posts - user {userId}</h2>
            {!newPost ? <button style={{ marginLeft: "40%", backgroundColor: 'yellowgreen' }} onClick={() => setNewPost(true)} >Add</button> : null}
            {newPost && (
              <div style={{ border: "2px solid black" }}>
                <h3 style={{ marginLeft: "25%" }}>Title : <input type="text" value={newPostData.title} name='title' onChange={handlePostData} /></h3>
                <h3 style={{ marginLeft: "25%" }}>Body : <input type="text" value={newPostData.body} name='body' onChange={handlePostData} /></h3>
                <button style={{ marginLeft: "55%", backgroundColor: 'yellowgreen' }} onClick={handleClickCancelPost} >Cancel</button>
                <button style={{ marginLeft: "5%", backgroundColor: 'yellowgreen', marginBottom: "3%" }} onClick={handleNewPost} >Add</button>
              </div>
            )}

            {!newPost && (
              <div style={{ border: "2px solid black" }}>
                {
                  posts.filter((post) => post.userId == userId).map((post) => {
                    return <div key={post.id} style={{ border: "2px solid purple", width: "80%", marginLeft: "10%", marginTop: "10px" }}>
                      <h4>Title : {post.title}</h4>
                      <h4>Body : {post.body}</h4>
                    </div>
                  })
                }
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add New User Section */}
      {
        addNewUser && (
          <div >
            <h2 style={{marginRight:"340px"}}>Add New User</h2>
            <div style={{ border: "2px solid black", width: "500px" }}>
              <strong>Name:  </strong>  <input type="text" onChange={handleUserData} name='name' value={newUserData.name} /><br />
              <strong>Email:  </strong>  <input type="text" onChange={handleUserData} name='email' value={newUserData.email} /><br />
              <button style={{ marginLeft: "55%", backgroundColor: 'yellowgreen' }} onClick={handleClickCancelUser} >Cancel</button>
              <button style={{ marginLeft: "5%", backgroundColor: 'yellowgreen', marginBottom: "3%" }} onClick={handleAddUser} >Add</button>
            </div>
          </div>
        )}
    </div>
  )
}

export default Present_Todo_post