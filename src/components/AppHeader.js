import React, { useContext } from "react";
import LogoutBtn from "./LogoutBtn";
import { store } from "../store/store";

export default function AppHeader() {
  const { state } = useContext(store);

  return (
    <>
      {state.loginStatus === "loggedIn" ? (
        <div className="float-right">
          <LogoutBtn />
        </div>
      ) : null}

      <h1 className="text-center">Log Monitor App</h1>
    </>
  );
}
