import React, { useContext } from "react";
import { store } from "../store/store";
import Axios from "axios";

export default function LogoutBtn() {
  const { dispatch } = useContext(store);
  return <button onClick={onClickLogoutBtn}>Logout</button>;

  function onClickLogoutBtn() {
    Axios.post(
      "http://localhost:8000/api/logout",
      {},
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        console.log("Axios logout succeeded. res=", res);
        dispatch({ type: "logout" });
      })
      .catch((e) => {
        console.log("Axios logout error. e=", e);
      });
  }
}
