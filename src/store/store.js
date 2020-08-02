import React, { createContext, useReducer } from "react";
// import Axios from 'axios';

const initialState = {
  loginStatus: localStorage.getItem("loginStatus")
    ? localStorage.getItem("loginStatus")
    : "",
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "login":
        return {
          ...state,
          loginStatus: "loggedIn",
        };

      case "loginSucceeded":
        return {
          ...state,
          loginStatus: "loggedIn",
        };

      case "setUser":
        return {
          ...state,
          loginStatus: "loggedIn",
          user: action.data
        }

      case "logout":
        // Axios.post("http://localhost:8000/api/logout", {}, {
        //   headers: {
        //     'Authorization': 'Bearer ' + state.token,
        //   }
        // } ).then((res) =>{
        //     console.log("Axios logout response = ", res);
        //     localStorage.setItem('loginStatus', 'loggedOut');
        //     localStorage.removeItem('token');
        //     return {
        //       ...state,
        //       loginStatus: 'logout'
        //   };
        //   }).catch((e) => {
        //     console.log("Axios log out error. e=", e)
        //     return state;
        //   });
        return {
          ...state,
          loginStatus: "loggedOut",
        };

      case "setToken":
        return {
          ...state,
          loginStatus: "loggedIn",
          token: action.data.token,
        };

      default:
        console.log("action.type=", action.type);
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
