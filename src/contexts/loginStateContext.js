import React from 'react';

const loginStateContext = React.createContext({loginState: 'logged_out'});

export {
    loginStateContext
};