import React from 'react';

const Sidebar = ({ tagList, handleTagClick }) => {
  return (
    <div className="container" style={{ background: '#f3f3f3', borderRadius: '4px', padding: '5px 10px 10px' }}>
      <p>Popular Tags</p>
      <div className="tag-list">
        {tagList === null ? (
          <div>Loading...</div>
        ) : (
          tagList.tags.map((tag, index) => (
            <a key={index} href="#" className="tag-pill tag-default" style={{ textDecoration: 'none' }} onClick={() => handleTagClick(tag)}>
              {tag}
            </a>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
