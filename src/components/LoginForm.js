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
      <h2 style={{textAlign: "center"}}>Please Login</h2>
      <div className="form-group">
        <label>Username</label>
        <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
        <button className="btn btn-outline-secondary" onClick={() => submit()}>Submit</button>
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
            console.log("login succeeded response data= ", res.data);
            globalState.dispatch({type: 'loginSucceeded', data: res.data})
          }
        })
        .catch((e) => {
          console.log("Axios login error. error=", e);
        });
  
    })
  }
}
