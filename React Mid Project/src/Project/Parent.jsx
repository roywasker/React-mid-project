import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Present_Users from './Present_Users'
import Present_Todo_post from './Present_Todo_post'

const Parent = () => {

    //Constants to store the URLs to get the data
    const USER_URL = `https://jsonplaceholder.typicode.com/users`
    const POSTS_URL = `https://jsonplaceholder.typicode.com/posts`
    const TODOS_URL = `https://jsonplaceholder.typicode.com/todos`

    // State variables to store fetched data and app behavior
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [todos, setTodos] = useState([])
    const [showTodoPost, setShowTodoPost] = useState(0) // Tracks the selected user ID for todos and posts
    const [addNewUser, setAddNewUser] = useState(false) // Tracks whether the "Add New User" feature is active


    //Fetch data from APIs when the component mounts and set border color to each user
    useEffect(() => {
        const fetchData = async () => {
            // Fetch data from all URLs 
            const { data: userData } = await axios.get(`${USER_URL}`)
            const { data: postsData } = await axios.get(`${POSTS_URL}`)
            const { data: todosData } = await axios.get(`${TODOS_URL}`)

            // Add a "color" attribute to users based on whether they have incomplete todos
            const userDataWithColor = userData.map((user) => {
                const userTodos = postsData.filter((todo) => todo.userId === user.id);
                const hasIncompleteTodos = userTodos.some((todo) => !todo.completed);
                return { ...user, color: hasIncompleteTodos ? 'red' : 'green' };
            })

            // Update state with fetched data
            setUsers(userDataWithColor)
            setPosts(postsData)
            setTodos(todosData)
        };
        fetchData();
    }, [])

    useEffect(() => {
        if (addNewUser) {
            setAddNewUser(true)
        }
    }, [addNewUser])


    /**
     * Updates user data in state
     * @param {*} updateData User data to update
     */
    const updateUserData = (updateData) => {
        setUsers((prevData) => prevData.map((user) =>
            user.id == updateData.id ? { ...user, ...updateData } : user
        ))
    }

    /**
     * Deletes a user from the state
     * @param {*} userToDelete User ID to delete
     */
    const deleteUser = (userToDelete) => {
        const newUsersList = users.filter((user) => user.id != userToDelete.id)
        setUsers(newUsersList)
    }

    /**
     * Marks a todo as completed 
     * @param {*} todoId Todo ID to mark
     */
    const markTodoComplete = (todoId) => {
        const markedTodo = todos.find((todo) => todo.id == todoId) //Find the specific todo
        markedTodo.completed = true
        //Updata this todo in state
        setTodos((prevData) => prevData.map((todo) =>
            todo.id == todoId ? { ...markedTodo } : todo
        ))
    }

    /**
     * Adds a new todo for the selected user
     * @param {*} todoTitle Todo title to create new todo
     */
    const addNewTodo = (todoTitle) => {
        const newTodo = {
            userId: showTodoPost,
            id: todos[todos.length - 1].id + 1, // Generate new ID
            title: todoTitle,
            completed: false,
        }
        setTodos([...todos, newTodo]) // Append the new todo to the existing list
    }

    /**
     * Adds a new post for the selected user
     * @param {*} postData Post data (title and body)
     */
    const addNewpost = (postData) => {
        const newPost = {
            userId: showTodoPost,
            id: posts[posts.length - 1].id + 1, // Generate new ID
            title: postData.title,
            body: postData.body,
        }
        setPosts([...posts, newPost])   // Append the new post to the existing list
    }

    /**
     * Adds a new user with name and email
     * @param {*} userData User data (name an email)
     */
    const addUserWithData = (userData) => {
        const newuser = {
            id: (users.length>0)? users[users.length - 1].id + 1 : 1, // Generate new ID
            name: userData.name,
            email: userData.email,
        }
        setUsers([...users, newuser])
    }

    /**
     * set addNewUser state to false
     */
    const setAddUserFalse = () => {
        setAddNewUser(false)
    }

    return (
        <div style={{ display: "grid", gridTemplateColumns: "500px 1000px" }}>
            {/* Render the Present_Users component and pass relevant props */}
            <Present_Users users={users} todos={todos} userIdTodoPost={showTodoPost} updateUserIdTodoPost={setShowTodoPost} updateUserData={updateUserData} deleteUser={deleteUser} setAddNewUser={setAddNewUser} />
            {/* Render the Present_Todo_post component and pass relevant props */}
            <Present_Todo_post userId={showTodoPost} todos={todos} posts={posts} markTodoComplete={markTodoComplete} addNewTodo={addNewTodo} addNewpost={addNewpost} addNewUser={addNewUser} setAddNewUser={setAddUserFalse} addUserWithData={addUserWithData} />
        </div>
    )
}

export default Parent