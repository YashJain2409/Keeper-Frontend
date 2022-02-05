import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../context/auth-context";
import { CircularProgress } from "@mui/material";
function Login() {
  const [login, setLogin] = useState(true);
  const [error, setError] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const authctx = useContext(AuthContext);
  const history = useHistory();
  function formSubmitHandler(event) {
    setIsSubmitted(true);
    let url;
    if (login) url = "/login";
    else url = "/register";
    event.preventDefault();
    const obj = {
      email: event.target[0].value,
      password: event.target[1].value,
    };
    event.target[0].value = "";
    event.target[1].value = "";
    fetch(url, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setIsSubmitted(false);
        if (data.token) {
          if (login) {
            authctx.login(data.token);
            history.replace("/notes");
          } else {
            setLogin(true);
            history.replace("/");
            setRegistered(true);
            setTimeout(() => {
              setRegistered(false);
            }, 1000);
          }
        } else {
          setError(data.message);
          setTimeout(() => {
            setError(null);
          }, 1000);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function switchMode(event) {
    event.preventDefault();
    setLogin((prevState) => !prevState);
  }
  return (
    <div
      className="card"
      style={{
        margin: "100px auto",
        padding: "50px",
        width: "500px",
        textAlign: "center",
        borderRadius: "10px",
      }}
    >
      {login ? (
        <h1 style={{ marginBottom: "32px" }}>Login</h1>
      ) : (
        <h1 style={{ marginBottom: "32px" }}>Sign up</h1>
      )}
      <form onSubmit={formSubmitHandler}>
        <div className="form-group">
          <label htmlFor="InputEmail">Email address</label>
          <input
            type="email"
            className="form-control"
            id="InputEmail"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="form-group">
          <label htmlFor="InputPassword">Password</label>
          <input
            type="password"
            className="form-control"
            id="InputPassword"
            minLength="7"
          />
        </div>
        {!isSubmitted ? (
          <button
            type="submit"
            className="btn"
            style={{ backgroundColor: "#f5ba13", color: "white" }}
          >
            {login ? "Login" : "Create Account"}
          </button>
        ) : (
          <CircularProgress
            style={{ margin: "0 auto", display: "block", color: "yellow" }}
          />
        )}
        <div>
          <button
            onClick={switchMode}
            style={{
              marginTop: "16px",
              backgroundColor: "transparent",
              color: "#f5ba13",
              border: "none",
            }}
          >
            {login ? "create new account" : "login with existing account"}
          </button>
        </div>
      </form>
      {registered && (
        <p style={{ color: "green", marginTop: "5px" }}>
          successfully registered
        </p>
      )}
      {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
    </div>
  );
}

export default Login;
