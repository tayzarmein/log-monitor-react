import React, { useContext } from "react";
import { store } from "../store/store";
import Axios from "axios";

export default function LogoutBtn() {
  const { state, dispatch } = useContext(store);

  // return <button onClick={onClickLogoutBtn}>Logout</button>;

  return (
    // <DropdownButton variant="outline-dark text-secondary" title={state.username || "username"}>
    //   <Dropdown.Item onClick={() => onClickLogoutBtn()}>Logout</Dropdown.Item>
    // </DropdownButton>
    <div className="dropdown">
      <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown">{state.username || "username"}</button>
      <div className="dropdown-menu">
        <button className="dropdown-item" onClick={() => onClickLogoutBtn()}>Logout</button>
      </div>
    </div>
  )

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
