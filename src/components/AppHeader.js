import React, { useContext } from "react";
import LogoutBtn from "./LogoutBtn";
import { store } from "../store/store";

export default function AppHeader() {
  const { state } = useContext(store);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-10">
          <h2 className="text-center">Log Monitor App</h2>{" "}
        </div>
        <div className="col-sm-2 align-self-center">
          {state.loginStatus === "loggedIn" ? <LogoutBtn /> : null}
        </div>
      </div>
    </div>
  );
}
