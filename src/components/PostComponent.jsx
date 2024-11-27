import React from 'react';
import "../App.css";

const PostComponent = ({ posts, handleDelete, handleEdit }) => {
  return (
    <div className="post-summary">
      {posts.map((post) => (
        <div key={post.id} className="post-summary-item">
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <div className="actions">
            <button onClick={() => handleEdit(post.id)}>Edit</button>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostComponent;
