import React, { useState, useEffect, useContext } from "react";
import "./App.css";
import Axios from "axios";
import LoginForm from "./components/LoginForm";
import { store } from "./store/store";
import MainUI from "./components/MainUI";

function App() {
  const [dataState, setDataState] = useState("loading");
  const [loading, setLoading] = useState(true);

  const context = useContext(store);
  const globalState = context.state;
  const globalDispatch = context.dispatch;


  useEffect(() => {
    Axios.get("http://localhost:8000/api/user", {
      withCredentials: true,
    })
      .then((res) => {
        globalDispatch({ type: "setUser", data: res.data });
        setLoading(false);
      })
      .catch((e) => {
        console.log("Axios get error. e=", e);
        setLoading(false);

        if (e.request.status === 401) {
          globalDispatch({ type: "logout" });
          return undefined;
        }
        setDataState("error");
      });
  }, [globalDispatch]);

  if (loading) {
    return <h2>Loading</h2>;
  }

  if (globalState.loginStatus === "loggedOut") {
    return <LoginForm />;
  }

  if (dataState === "error") {
    return <h2>Error connecting with the backend.</h2>;
  }

  return <MainUI />
}

export default App;
