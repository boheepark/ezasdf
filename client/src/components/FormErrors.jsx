import React from 'react';

import './FormErrors.css';


const FormErrors = (props) => {
    return (
        <div>
            <ul className="validation-list">
                {
                    // eslint-disable-next-line
                    props.formRules.map((rule) => {
                        if (rule.field === 'username') {
                            if (props.formType === 'signup') {
                                return <li
                                    className={rule.valid ? "success" : "error"}
                                    key={rule.id}
                                >{rule.message}
                                </li>
                            }
                        } else {
                            return <li
                                className={rule.valid ? "success" : "error"}
                                key={rule.id}
                            >{rule.message}
                            </li>
                        }
                    })
                }
            </ul>
        </div>
    )
};

export default FormErrors;
