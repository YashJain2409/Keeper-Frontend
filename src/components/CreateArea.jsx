import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";

function CreateArea(props) {
  const [valid,setValid] = useState(true);
  const [vis, setVis] = useState(false);
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  function submitNote() {
    if (note.title === "" || note.content === "") {
      setValid(false);
      setTimeout(() => {
        setValid(true);
      },1000);
      return;
    }
    props.onAdd(note);
    setNote({
      title: "",
      content: "",
    });
  }

  return (
    <div>
      <form className="create-note">
        {vis && (
          <input
            required
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
        )}
        <textarea
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={vis ? 3 : 1}
          onClick={() => {
            setVis(true);
          }}
        />
        <Zoom in={vis}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
        {!valid && <p style={{color: 'red'}}>please add some data , some fields are empty.</p>}
      </form>
    </div>
  );
}

export default CreateArea;
