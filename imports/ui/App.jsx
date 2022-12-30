import React, { useState, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { NotesCollection } from "../api/NotesCollection.js";
import { Note } from "./Note.jsx";
import autosize from "autosize";

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
const destroy = (ids) => {
    ids.forEach((i) => NotesCollection.remove(i));
};

// update note in db
const update = (note) => {
    NotesCollection.update(note._id, { $set: { ...note } });
};

export const App = () => {
    const [query, setQuery] = useState("");
    // fetch notes form newest - oldest
    const notes = useTracker(() =>
        NotesCollection.find(
            query
                ? {
                      $or: [
                          { title: { $regex: query, $options: "i" } },
                          { text: { $regex: query, $options: "i" } },
                      ],
                  }
                : {},
            {
                sort: { createdAt: -1 },
            }
        ).fetch()
    );

    // state for which note is open
    const [openNote, setOpenNote] = useState("");

    // select mode state
    const [selectMode, setSelectMode] = useState(false);

    // selected state
    const [selected, setSelected] = useState([]);

    // search query state

    const toggleSelect = (event, id) => {
        selected.includes(id)
            ? setSelected(selected.filter((i) => i !== id))
            : setSelected([...selected, id]);
    };

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

    // autosize needs updating when details element is opened
    useEffect(() => {
        if (openNote !== "")
            autosize.update(document.querySelectorAll("textarea"));
    }, [openNote, selectMode]);

    return (
        <main>
            <header>
                <h1>Notes</h1>
                <button
                    className="icon-button action"
                    type="button"
                    onClick={create}
                >
                    <svg
                        preserveAspectRatio="none"
                        width="100%"
                        height="100%"
                        viewBox="0 0 48 48"
                        fill="seagreen"
                    >
                        <path d="M9 47.4q-1.2 0-2.1-.9-.9-.9-.9-2.1v-30q0-1.2.9-2.1.9-.9 2.1-.9h20.25l-3 3H9v30h30V27l3-3v20.4q0 1.2-.9 2.1-.9.9-2.1.9Zm15-18Zm9.1-17.6 2.15 2.1L21 28.1v4.3h4.25l14.3-14.3 2.1 2.1L26.5 35.4H18v-8.5Zm8.55 8.4-8.55-8.4 5-5q.85-.85 2.125-.85t2.125.9l4.2 4.25q.85.9.85 2.125t-.9 2.075Z" />
                    </svg>
                </button>
            </header>
            <div className="main-menu">
                <button
                    className="icon-button"
                    selected={selectMode}
                    type="button"
                    onClick={() => {
                        setSelectMode(!selectMode);
                        setSelected([]);
                    }}
                >
                    <svg
                        preserveAspectRatio="none"
                        width="100%"
                        height="100%"
                        viewBox="0 0 48 48"
                        fill="seagreen"
                        opacity={selectMode ? 0.5 : 1}
                    >
                        <path d="M21.05 33.1 35.2 18.95l-2.3-2.25-11.85 11.85-6-6-2.25 2.25ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.15 1.575-7.8 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24 4q4.15 0 7.8 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm0-3q7.1 0 12.05-4.975Q41 31.05 41 24q0-7.1-4.95-12.05Q31.1 7 24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24 41Zm0-17Z" />
                    </svg>
                </button>
            </div>
            <input
                type="text"
                placeholder="Search"
                className="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            ></input>
            <ul className="notes-list">
                {notes.map((note) => (
                    <Note
                        index={note._id}
                        selectMode={selectMode}
                        key={note._id}
                        note={note}
                        destroy={destroy}
                        update={update}
                        open={openNote === note._id}
                        toggleOpen={toggleOpen}
                        toggleSelect={toggleSelect}
                    />
                ))}
            </ul>
            <div className="select-menu">
                {selectMode && (
                    <button
                        type="button"
                        disabled={selected.length === 0}
                        onClick={() => {
                            destroy(selected);
                            setSelected([]);
                            setSelectMode(false);
                        }}
                    >
                        Delete Selected
                    </button>
                )}
            </div>
        </main>
    );
};
