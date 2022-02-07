import React, { useCallback, useContext, useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Auth from "./Auth";
import Header from "./Header";
import Footer from "./Footer";
import CreateArea from "./CreateArea";
import NotesList from "./NotesList";
import { CircularProgress } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import AuthContext from "../context/auth-context";

function App() {
  const authctx = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchNotes = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(process.env.REACT_APP_BACKEND_URL +  "/notes/fetch", {
      method: "GET",
      headers: {
        "auth-token": authctx.token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          setLoading(false);
          throw new Error("something went wrong!");
        }
        return response.json();
      })
      .then((data) => {
        setNotes(data);
        setTimeout(function () {
          setLoading(false);
        }, 500);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [authctx.token]);

  useEffect(() => {
    if (authctx.token) fetchNotes();
  }, [fetchNotes, authctx.token]);

  function addNote(newNote) {
    const obj = {
      ...newNote,
      id: uuidv4(),
    };
    fetch(process.env.REACT_APP_BACKEND_URL +  "/notes/add", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "auth-token": authctx.token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        fetchNotes();
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function deleteNote(id) {
    fetch(process.env.REACT_APP_BACKEND_URL +  "/notes/delete", {
      method: "DELETE",
      body: JSON.stringify({ id: id }),
      headers: {
        "auth-token": authctx.token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        fetchNotes();
      })
      .catch((error) => {
        setError(error.message);
      });
  }
  const textAlign = {
    textAlign: "center",
  };
  let content = <p style={textAlign}>Found no notes</p>;
  if (notes.length > 0)
    content = <NotesList notes={notes} deleteNote={deleteNote} />;
  if (error) content = <p style={textAlign}>{error}</p>;
  if (loading)
    content = (
      <CircularProgress
        style={{ margin: "0 auto", display: "block", color: "yellow" }}
      />
    );

  return (
    <div>
      <Header />
      <Switch>
        <Route path="/" exact>
          {!authctx.isLoggedIn ? <Auth /> : <Redirect to="/notes" />}
        </Route>
        {authctx.isLoggedIn && (
          <Route path="/notes" exact>
            <div>
              <CreateArea onAdd={addNote} />
              {content}
            </div>
          </Route>
        )}
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
