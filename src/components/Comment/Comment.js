import React from 'react';

import './Comment.css';

const Comment = (props) => {

  return (
    <div className="Comment" >
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