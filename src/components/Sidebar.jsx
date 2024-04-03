import React from 'react';
import "./css/styles.css";

const Sidebar = ({ tagList, handleTagClick }) => {
  return (
    <div className="container" style={{ background: '#f3f3f3', borderRadius: '4px', padding: '5px 10px 10px' }}>
      <p>Popular Tags</p>
      <div className="tag-list">
        {tagList === null ? (
          <div>Loading...</div>
        ) : (
          tagList.tags.map((tag, index) => (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a key={index} href="#" className="tag-pill tag-default sidebar-tag" style={{ textDecoration: 'none' }} onClick={() => handleTagClick(tag)}>
              {tag}
            </a>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
