import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import PostComponent from "./PostComponent";
import "../App.css";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(
    location.state?.selectedUserId || 1
  );
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [updatedPosts, setUpdatedPosts] = useState([]);
  const [todos, setTodos] = useState([]);
  const [comments, setComments] = useState([]);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/users").then((res) => setUsers(res.data));
  }, []);

  useEffect(() => {
    axios
      .get(`https://jsonplaceholder.typicode.com/users/${selectedUserId}`)
      .then((res) => setUser(res.data));
    axios
      .get(`https://jsonplaceholder.typicode.com/posts?userId=${selectedUserId}`)
      .then((res) => {
        setPosts(res.data);
        const storedUpdatedPosts = JSON.parse(localStorage.getItem("updatedPosts") || "[]");
        const mergedPosts = res.data.map((post) => {
          const updatedPost = storedUpdatedPosts.find((p) => p.id === post.id);
          return updatedPost || post;
        });
        setUpdatedPosts(mergedPosts);
      });
    axios
      .get(`https://jsonplaceholder.typicode.com/todos?userId=${selectedUserId}`)
      .then((res) => setTodos(res.data));
    axios.get("https://jsonplaceholder.typicode.com/comments").then((res) => setComments(res.data));
  }, [selectedUserId]);

  useEffect(() => {
    if (!location.state || !location.state.selectedUserId) {
      setSelectedUserId(1);
      navigate("/", { state: { selectedUserId: 1 } });
    }
  }, [location.state, navigate]);

  const handleDelete = (id) => {
    toast.custom((t) => (
      <div className="toast-container">
        <p>Are you sure you want to delete this post?</p>
         <div style={{display:"flex",gap:"10px"}}>
         <button
          className="toast-btn confirm"
          onClick={() => {
            toast.dismiss(t.id);
            axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`).then(() => {
              setPosts(posts.filter((post) => post.id !== id));
              setUpdatedPosts(updatedPosts.filter((post) => post.id !== id));
              toast.success("Post Deleted Successfully!");
            });
          }}
        >
          Yes
        </button>
        <button className="toast-btn cancel" onClick={() => toast.dismiss(t.id)}>
          No
        </button>
         </div>
      </div>
    ));
  };

  const handleEdit = (id) => {
    toast.custom((t) => (
      <div className="toast-container">
        <p>Are you sure you want to edit this post?</p>
        <div style={{display:"flex",gap:"10px"}}>
        <button
          className="toast-btn confirm"
          onClick={() => {
            toast.dismiss(t.id);
            navigate(`/post/${id}`);
          }}
        >
          Yes
        </button>
        <button className="toast-btn cancel" onClick={() => toast.dismiss(t.id)}>
          No
        </button>
        </div>
      </div>
    ));
  };

  const summaryData = [
    { name: "Posts", value: updatedPosts.length },
    {
      name: "Comments",
      value: comments.filter((c) => updatedPosts.map((p) => p.id).includes(c.postId)).length,
    },
    { name: "Todos", value: todos.length },
  ];

  return (
    <div className="dashboard">
      <div className="card user-selection-card">
        <label htmlFor="user-select">Select User:</label>
        <select
          id="user-select"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(Number(e.target.value))}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="card user-card">
        <h1>{user.name}'s Dashboard</h1>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>Company: {user.company?.name}</p>
      </div>

      <div className="card chart-card">
        <h2>Summary</h2>
        <PieChart width={200} height={200}>
          <Pie data={summaryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            {summaryData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <div className="card todos-card">
        <h2>Todos</h2>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <span>{todo.title}</span>
              <button
                className={`todo-status-btn ${
                  todo.completed ? "status-completed" : "status-pending"
                }`}
              >
                {todo.completed ? "Completed" : "Pending"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card posts-card">
        <h2>Posts</h2>
        <PostComponent posts={updatedPosts} handleDelete={handleDelete} handleEdit={handleEdit} />
      </div>
    </div>
  );
};

export default Dashboard;
