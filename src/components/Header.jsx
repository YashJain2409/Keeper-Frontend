import React, { useContext } from "react";
import HighlightIcon from "@mui/icons-material/Highlight";
import AuthContext from "../context/auth-context";
function Header() {
  const authctx = useContext(AuthContext);
  const isLoggedIn = authctx.isLoggedIn;
  const logoutHandler = () => {
    authctx.logout();
  }
  return (
    <header>
      <h1>
        <HighlightIcon />
        Keeper
      </h1>
      {isLoggedIn && (
        <button
          className="btn"
          style={{
            backgroundColor: "#fff",
            color: "#f5ba13",
            float: "right",
            marginTop: "10px",
          }}
          onClick={logoutHandler}
        >
          logout
        </button>
      )}
    </header>
  );
}

export default Header;
