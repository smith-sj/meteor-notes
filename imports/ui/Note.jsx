import React, { useState, useEffect } from "react";
import autosize from "autosize";

export const Note = ({
    note,
    selectMode,
    open,
    update,
    toggleOpen,
    index,
    toggleSelect,
}) => {
    // pressing Space when input focused closes details element.
    // prevent the default behavior only when input in focus.
    const [titleFocus, setTitleFocus] = useState(false);
    const handleSpace = (e) => {
        if (e.code === "Space" && titleFocus) e.preventDefault();
    };

    // automatically adjust textarea size to fit text
    // (very lightweight package that works flawlessly)
    autosize(document.querySelectorAll("textarea"));

    const [value, setValue] = useState(note);

    useEffect(() => {
        update(value);
    }, [value]);

    return (
        <li className="note">
            <div
                className="container"
                style={{ left: selectMode ? "0" : "-2.3rem" }}
            >
                <div className="round">
                    <input
                        type="checkbox"
                        onChange={(e) => toggleSelect(e, note._id)}
                        id={`checkbox${index}`}
                    />
                    <label htmlFor={`checkbox${index}`}>
                        <div className="tick"></div>
                    </label>
                </div>
            </div>
            <details
                open={open}
                onClick={(e) => toggleOpen(e, note._id)}
                style={{ left: selectMode ? "0" : "-2.3rem" }}
            >
                <summary onKeyUp={handleSpace}>
                    {open ? (
                        note && (
                            <input
                                style={{
                                    width: `${note.title.length + 1}ch`,
                                }}
                                onFocus={() => setTitleFocus(true)}
                                onBlur={() => setTitleFocus(false)}
                                type="text"
                                value={note.title}
                                onChange={(e) =>
                                    update({
                                        ...note,
                                        title: e.target.value,
                                    })
                                }
                            />
                        )
                    ) : (
                        <h3>{note.title}</h3>
                    )}
                    {!open && (
                        <span>
                            {note.createdAt.toLocaleString("en-US", {
                                hour12: true,
                                dateStyle: "short",
                                timeStyle: "short",
                            })}
                        </span>
                    )}
                </summary>
                <textarea
                    value={value.text}
                    placeholder="(empty)"
                    onChange={(e) =>
                        setValue({ ...value, text: e.target.value })
                    }
                />
                {open && (
                    <span>
                        {note.createdAt.toLocaleString("en-US", {
                            hour12: true,
                            dateStyle: "short",
                            timeStyle: "short",
                        })}
                    </span>
                )}
            </details>
        </li>
    );
};
