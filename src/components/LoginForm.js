import React, { useState, useContext } from "react";
import { store } from "../store/store";
import Axios from "axios";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const globalState = useContext(store);

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
    Axios.post("http://localhost:8000/api/login", {
      email,
      password,
      password_confirmation: password,
    })
      .then((res) => {
        console.log("Axios login successed. res data =", res.data);
        if(res.data.token) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('loginStatus', 'loggedIn');
        }
        globalState.dispatch({ type: "setToken", data: res.data });
      })
      .catch((e) => {
        console.log("Axios login error. error=", e);
      });
  }
}
