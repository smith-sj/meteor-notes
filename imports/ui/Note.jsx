import React from "react";

export const Note = ({ note, destroy, open, update, toggleOpen }) => (
    <li>
        <details open={open} onClick={(e) => toggleOpen(e, note._id)}>
            <summary>
                {/* Title is an <h3> if note closed or an <input> if open */}
                <span>
                    {note.createdAt.toLocaleString("en-US", {
                        hour12: true,
                        dateStyle: "short",
                        timeStyle: "short",
                    })}
                </span>
                {open ? (
                    <input
                        type="text"
                        value={note.title}
                        onChange={(e) =>
                            update({ ...note, title: e.target.value })
                        }
                    />
                ) : (
                    <h3>{note.title.substring(0, 20)}</h3>
                )}
            </summary>
            <textarea
                value={note.text}
                onChange={(e) => update({ ...note, text: e.target.value })}
            />
            <input type="button" onClick={() => destroy(note)} value="delete" />
        </details>
    </li>
);
