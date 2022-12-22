import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { NotesCollection } from "../api/NotesCollection.js";
import { Note } from "./Note.jsx";

// create note
// TODO: set new notes open and focus automatically
const create = () => {
    NotesCollection.insert({
        title: "New Note",
        text: "",
        createdAt: new Date(),
    });
};

// delete note from db
const destroy = ({ _id }) => {
    NotesCollection.remove(_id);
};

// update note in db
const update = (note) => {
    NotesCollection.update(note._id, { $set: { ...note } });
};

export const App = () => {
    // fetch notes form newest - oldest
    const notes = useTracker(() =>
        NotesCollection.find({}, { sort: { createdAt: -1 } }).fetch()
    );

    // state for which note is open
    const [openNote, setOpenNote] = useState("");

    // set which note is open on click
    const toggleOpen = (event, id) => {
        // abort if target is input or textarea
        if (
            event.target instanceof HTMLTextAreaElement ||
            event.target instanceof HTMLInputElement
        )
            return;
        // prevents <details> element default behavior
        event.preventDefault();
        // set openNote, or remove it if already open
        setOpenNote(openNote === id ? "" : id);
    };

    return (
        <div>
            <h1>Notes</h1>
            <button type="button" onClick={create}>
                New Note
            </button>

            <ul className="notes-list">
                {notes.map((note) => (
                    <Note
                        key={note._id}
                        note={note}
                        destroy={destroy}
                        update={update}
                        open={openNote === note._id}
                        toggleOpen={toggleOpen}
                    />
                ))}
            </ul>
        </div>
    );
};
