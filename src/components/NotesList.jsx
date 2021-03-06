import React from "react";
import Note from "./Note";

function NotesList(props) {
    const notes = props.notes;
    return<div>{notes.map((noteItem) => {
        return (
          <Note
            key={noteItem._id}
            id={noteItem._id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={props.deleteNote}
          />
        );
      })} </div>
}

export default NotesList;