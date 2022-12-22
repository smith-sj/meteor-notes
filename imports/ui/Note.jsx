import React, { useState } from "react";
import autosize from "autosize";

export const Note = ({ note, destroy, open, update, toggleOpen }) => {
    // pressing Space when input focused closes details element.
    // prevent the default behavior only when input in focus.
    const [titleFocus, setTitleFocus] = useState(false);
    const handleSpace = (e) => {
        if (e.code === "Space" && titleFocus) e.preventDefault();
    };

    autosize(document.querySelector("textarea"));

    return (
        <li className="note">
            <details open={open} onClick={(e) => toggleOpen(e, note._id)}>
                <summary onKeyUp={handleSpace}>
                    {open ? (
                        <input
                            onFocus={() => setTitleFocus(true)}
                            onBlur={() => setTitleFocus(false)}
                            type="text"
                            value={note.title}
                            onChange={(e) =>
                                update({ ...note, title: e.target.value })
                            }
                        />
                    ) : (
                        <h3>{note.title.substring(0, 20)}</h3>
                    )}
                    <span>
                        {note.createdAt.toLocaleString("en-US", {
                            hour12: true,
                            dateStyle: "short",
                            timeStyle: "short",
                        })}
                    </span>
                </summary>
                <textarea
                    autoFocus
                    value={note.text}
                    placeholder="(empty)"
                    onChange={(e) => update({ ...note, text: e.target.value })}
                />
                <input
                    type="button"
                    onClick={() => destroy(note)}
                    value="delete"
                />
            </details>
        </li>
    );
};
