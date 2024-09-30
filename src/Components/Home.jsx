import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

const App = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [todos, setTodos] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({
    id: null,
    title: "",
    description: "",
    createdBy: "",
    dueDate: "",
  });

  const findUserId = async (id) => {
    const token = localStorage.getItem("key");
    try {
      const response = await axios.get(
        `https://todos-backend-vxxj.onrender.com/api/user/find-user/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (!response) {
        console.log("User not found");
      }
      return response.data.userName || "Unknown";
    } catch (err) {
      console.log(err);
      return "Unknown"; // Return "Unknown" if there's an error
    }
  };

  const fetchUser = async (userId) => {
    if (usersMap[userId]) return; // If the user has already been fetched, skip
    const userName = await findUserId(userId);
    setUsersMap((prev) => ({
      ...prev,
      [userId]: userName, // Map the user ID to the fetched userName
    }));
  };

  const getUserFromToken = async () => {
    const token = localStorage.getItem("key");
    try {
      const response = await axios.get(
        `https://todos-backend-vxxj.onrender.com/api/user/get-user`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setCurrentUser(response.data._id);
      return response.data._id || "Unknown";
    } catch (err) {
      console.log(err);
      return "Unknown";
    }
  };

  const apiCall = async () => {
    const token = localStorage.getItem("key");
    try {
      const response = await axios.get(
        "https://todos-backend-vxxj.onrender.com/api/todos",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.data) {
        const apiData = response.data;
        setTodos(apiData);

        apiData.forEach((todo) => {
          fetchUser(todo.createdBy);
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    apiCall();
    getUserFromToken(); // Fetch current user once on component mount
  }, []);

  const handleAddTodo = async () => {
    const token = localStorage.getItem("key");

    if (!token) {
      console.log("No token found. Please log in.");
      return;
    }
    const { title, description, dueDate } = newTodo;
    if (!title || !description || !dueDate) {
      console.log("Title, Description, and Due Date are required.");
      return;
    }
    try {
      const response = await axios.post(
        "https://todos-backend-vxxj.onrender.com/api/todos/create",
        {
          title: title,
          description: description,
          dueDate: dueDate,
          createdBy: currentUser,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (!response) {
        console.log("No response from server. Could not add new Todo.");
        return;
      }

      setTodos([...todos, response.data]);
      setNewTodo({ title: "", description: "", dueDate: "" }); // Clear the form after submission
    } catch (err) {
      if (err.response) {
        // Server responded with a status other than 200 range
        console.log(`Server error: ${err.response.data.message}`);
      } else if (err.request) {
        // Request was made but no response received
        console.log("Network error: No response received from server.");
      } else {
        // Something else happened while setting up the request
        console.log(`Error: ${err.message}`);
      }
    }
  };

  // Edit Todo
  const handleEditTodo = async (id) => {
    const token = localStorage.getItem("key");
    try {
      const { title, description } = currentTodo;
      if (!title || !description) {
        console.log("Title and Description are required.");
        return;
      }

      const existingTodo = todos.find((todo) => todo._id === id);
      if (
        existingTodo &&
        existingTodo.title === title &&
        existingTodo.description === description
      ) {
        console.log("No changes detected. Update not required.");
        setIsEditing(false);
        return;
      }

      const response = await axios.put(
        `https://todos-backend-vxxj.onrender.com/api/todos/update-todo/${id}`,
        {
          title: title,
          description: description,
          createdBy: currentTodo,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      setIsEditing(false);
      setCurrentTodo({ id: null, title: "", description: "", createdBy: "" });
    } catch (err) {
      console.log(err);
    }
  };

  // Delete Todo
  const handleDeleteTodo = async (id) => {
    const token = localStorage.getItem("key");
    try {
      await axios.delete(
        `https://todos-backend-vxxj.onrender.com/api/todos/delete/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">Todo List</h1>

      {/* Input fields to add new todo */}
      <div className="mb-6">
        <input
          type="text"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
          placeholder="Title"
        />
        <input
          type="text"
          value={newTodo.description}
          onChange={(e) =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
          placeholder="Description"
        />
        <input
          type="date"
          value={newTodo.dueDate}
          onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
        />
        <button
          onClick={handleAddTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Add
        </button>
      </div>

      {todos.length === 0 ? (
        <p>No todos available.</p>
      ) : (
        <ul className="w-full max-w-lg">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="bg-white p-4 mb-4 rounded-lg shadow-lg flex justify-between items-center"
            >
              {isEditing && currentTodo.id === todo._id ? (
                <div>
                  <span className="block font-bold">Editing...</span>
                  <input
                    type="text"
                    value={currentTodo.title}
                    onChange={(e) =>
                      setCurrentTodo({ ...currentTodo, title: e.target.value })
                    }
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={currentTodo.description}
                    onChange={(e) =>
                      setCurrentTodo({
                        ...currentTodo,
                        description: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                    placeholder="Description"
                  />
                </div>
              ) : (
                <div>
                  <span className="block font-bold">{todo.title}</span>
                  <span className="block">{todo.description}</span>
                  <span className="block text-gray-500">
                    Created by: {usersMap[todo.createdBy] || "Loading..."}
                  </span>
                  <span className="block text-gray-500">
                    Due Date:
                    {() => {
                      const date = todo.dueDate;
                      format(new Date(date), "dd/MM/yyyy") || "Unknown";
                    }}
                  </span>
                </div>
              )}

              <div className="flex space-x-2">
                {isEditing && currentTodo.id === todo._id ? (
                  <button
                    onClick={() => handleEditTodo(todo._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setCurrentTodo({
                        id: todo._id,
                        title: todo.title,
                        description: todo.description,
                        createdBy: todo.createdBy,
                      }) || setIsEditing(true)
                    }
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteTodo(todo._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
