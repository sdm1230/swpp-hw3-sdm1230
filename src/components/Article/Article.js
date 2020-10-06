import React from 'react';

import './Article.css';

const Article = (props) => {

  return (
    <div className="Article" >
      <div className={'id'} >
        {props.id}
      </div>
      <button className={'title'} onClick={props.clickDetail}>
        {props.title}
      </button>
      <div className={'author'} >
        {props.author}
      </div>
      
    </div>
  );
};

export default Article;