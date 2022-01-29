import React from 'react';

const Post = ({id,image,message,date}) => {
    return (
        <div>
            <h2>{message}</h2>
        </div>
    );
};

export default Post;