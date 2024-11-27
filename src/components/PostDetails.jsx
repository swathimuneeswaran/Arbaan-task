import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../App.css";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [editedBody, setEditedBody] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((res) => {
        setPost(res.data);
        
       
        const updatedPosts = JSON.parse(localStorage.getItem('updatedPosts') || '[]');
        const existingPost = updatedPosts.find(p => p.id === res.data.id);
        
        
        setEditedBody(existingPost ? existingPost.body : res.data.body);
      })
      .catch(() => {
        
        navigate('/', { state: { selectedUserId: 1 } });
      });
  }, [id, navigate]);

  const handleSave = () => {
    const updatedPost = { ...post, body: editedBody };
    axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, updatedPost)
      .then(() => {
        try {
          const updatedPosts = JSON.parse(localStorage.getItem('updatedPosts') || '[]');
          const newUpdatedPosts = updatedPosts.filter(p => p.id !== updatedPost.id);
          newUpdatedPosts.push(updatedPost);
          localStorage.setItem('updatedPosts', JSON.stringify(newUpdatedPosts));
          
          alert('Post saved successfully!');
          navigate('/', { state: { selectedUserId: post.userId } });
        } catch (error) {
          
          console.error('localStorage error:', error);
          localStorage.clear();
          navigate('/', { state: { selectedUserId: 1 } });
        }
      })
      .catch(error => {
        console.error('Error updating post:', error);
        alert('Failed to save post');
        
        navigate('/', { state: { selectedUserId: 1 } });
      });
  };

  const handleBack = () => {
    try {
      const updatedPosts = JSON.parse(localStorage.getItem('updatedPosts') || '[]');
      if (updatedPosts.length === 0) {
       
        navigate('/', { state: { selectedUserId: 1 } });
      } else {
        
        navigate('/', { state: { selectedUserId: post.userId } });
      }
    } catch (error) {
      
      console.error('localStorage error:', error);
      localStorage.clear();
      navigate('/', { state: { selectedUserId: 1 } });
    }
  };

  return (
    <div className="post-details-container">
      <div className="post-details">
        <h2>{post.title}</h2>
        <textarea value={editedBody} onChange={(e) => setEditedBody(e.target.value)} />
        <button onClick={handleSave} className="btn save">Save</button>
        <button onClick={handleBack} className="btn back">Back</button>
      </div>
    </div>
  );
};

export default PostDetails;
