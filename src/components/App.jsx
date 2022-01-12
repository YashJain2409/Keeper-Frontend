import React, {  useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CreateArea from "./CreateArea";
import NotesList from "./NotesList";
import { CircularProgress } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotes =  () => {
    setLoading(true);
    setError(null);
    fetch("/fetchNotes").then(response => {
      if(!response.ok){
      setLoading(false);
      throw new Error("something went wrong!");
      }
      return response.json();
    }).then(data => {
      setNotes(data);
      setLoading(false);
    }).catch(error => {
      setError(error.message);
    });
    
    };


  useEffect(() => {
    fetchNotes();
  }, []);

  function addNote(newNote) {
    const obj = {
      ...newNote,
      id: uuidv4()
    }
    fetch("/add", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(response => {
       console.log("successfully fetched");
    }).catch(error => {
      setError(error.message);
    });
    fetchNotes();
  }



  function deleteNote(id) {
    console.log(id);
    fetch("/delete",{
      method: 'POST',
      body: JSON.stringify({id: id}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log("successfully deleted");
    });  
    fetchNotes();
  }
    const textAlign = {
      textAlign: 'center'    
    };
  let content = <p style={textAlign}>Found no notes</p>
  if(notes.length > 0)
  content = <NotesList notes = {notes} deleteNote={deleteNote}/>
  if(error)
  content = <p style={textAlign}>{error}</p>
  if(loading)
  content = <CircularProgress style={{margin: '0 auto',display: 'block',color: 'yellow'}}/>

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {content}
      <Footer />
    </div>
  );
}

export default App;
