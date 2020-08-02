import React, { useState, useContext } from "react";
import { store } from "../store/store";
import Axios from "axios";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const globalState = useContext(store);

  // console.log("WTZM_ENV=", process.env.REACT_APP_WTZM_ENV);

  // console.log("globalState=", globalState);
  return (
    <div>
      <h1>Please Login</h1>
      <p>
        email:{" "}
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </p>
      <p>
        Password:{" "}
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </p>
      <p>
        <button onClick={() => submit()}>Submit</button>
      </p>
    </div>
  );

  function submit() {
    const axios = Axios.create({});
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    axios.defaults.withCredentials = true;

    axios.get('http://localhost:8000/sanctum/csrf-cookie').then(res => {
      axios.post("http://localhost:8000/api/login", {
        email,
        password,
        password_confirmation: password,
      }, {
      })
        .then((res) => {
          console.log("Axios login successed. res data =", res.data);
          if(res.data.message === 'login succeeded') {
            console.log("login succeeded");
            globalState.dispatch({type: 'loginSucceeded'})
          }
        })
        .catch((e) => {
          console.log("Axios login error. error=", e);
        });
  
    })
  }
}
