import React, { useContext } from "react";
import { store } from "../store/store";
import Axios from "axios";
import { DropdownButton, Dropdown} from "react-bootstrap"

export default function LogoutBtn() {
  const { state, dispatch } = useContext(store);

  // return <button onClick={onClickLogoutBtn}>Logout</button>;

  return (
    <DropdownButton variant="outline-dark text-secondary" title={state.username || "username"}>
      <Dropdown.Item onClick={() => onClickLogoutBtn()}>Logout</Dropdown.Item>
    </DropdownButton>
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
