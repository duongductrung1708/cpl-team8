import React, { useState } from 'react';
import "./css/styles.css";

const Sidebar = ({ tagList, handleTagClick }) => {
  const [selectedTag, setSelectedTag] = useState(null);

  const handleTagSelection = (tag) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      handleTagClick(null);
    } else {
      setSelectedTag(tag);
      handleTagClick(tag);
    }
  };

  return (
    <div className="container filter-sidebar">
      <p>Popular Tags</p>
      <div className="tag-list">
        {tagList === null ? (
          <div>Loading...</div>
        ) : (
          tagList.tags.map((tag, index) => (
            <a
              key={index}
              href="#"
              className={`tag-pill tag-default sidebar-tag ${
                selectedTag === tag ? 'selected-tag' : 'unselected-tag'
              }`}
              style={{ textDecoration: 'none' }}
              onClick={() => handleTagSelection(tag)}
            >
              {tag}
            </a>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;