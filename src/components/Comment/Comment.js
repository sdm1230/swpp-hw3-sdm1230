import React from 'react';

import './Comment.css';

const Comment = (props) => {

  return (
    <div className="comment" >
      <div className={'username'} >
        {props.username}
      </div>
      <div className={'content'}>
        {props.comment}
      </div>
    </div>
  );
};

export default Comment;