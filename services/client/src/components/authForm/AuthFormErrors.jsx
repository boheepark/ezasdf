import React from 'react';

import './AuthFormErrors.css';


const AuthFormErrors = (props) => {
  return (
    <div>
      <ul className="validation-list">
        {
          props.formRules.map((rule) => {
            return (
              <li
                className={rule.valid ? "success" : "error"}
                key={rule.id}
              >{rule.message}
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default AuthFormErrors;
