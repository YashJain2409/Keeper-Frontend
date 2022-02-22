import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = true;

function CreateArea(props) {
  const [valid, setValid] = useState(true);
  const [vis, setVis] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    handleSpeech();
  }, [isListening]);
  function handleSpeech() {
    let content = note.content;
    if (isListening) {
      recognition.start();
      console.log("started");
      recognition.onend = () => {
        console.log("continue...");
        recognition.start();
      };
    } else {
      recognition.stop();
      recognition.onend = () => {
        console.log("stopped");
      };
      return;
    }
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      setNote((prevNote) => {
        return {
          ...prevNote,
          content: content + transcript + " ",
        };
      });
    };
  }
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
      }, 1000);
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
          readOnly={isListening ? "readOnly" : ""}
        />
        {vis &&
          (isListening ? (
            <MicIcon
              style={{
                cursor: "pointer",
                color: "#f5ba13",
              }}
              onClick={() => {
                setIsListening((prevState) => !prevState);
              }}
            />
          ) : (
            <MicOffIcon
              style={{
                cursor: "pointer",
                color: "#f5ba13",
              }}
              onClick={() => {
                setIsListening((prevState) => !prevState);
              }}
            />
          ))}
        <Zoom in={vis}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
        {!valid && (
          <p style={{ color: "red" }}>
            please add some data , some fields are empty.
          </p>
        )}
      </form>
    </div>
  );
}

export default CreateArea;
