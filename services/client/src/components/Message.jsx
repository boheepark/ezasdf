import React from 'react';


const Message = (props) => {
  return (
    <div className={`alert alert-${props.messageType}`}>
      <span
        className="glyphicon glyphicon-exclamation-sign"
        aria-hidden="true"
      />
      <span>&nbsp;{props.messageText}</span>
      <button
        className="close"
        data-dismiss="alert"
        onClick={()=>{props.removeMessage()}}
      >&times;
      </button>
    </div>
  );
};


export default Message;
