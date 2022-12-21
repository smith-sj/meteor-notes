import { Meteor } from "meteor/meteor";
import { NotesCollection } from "/imports/api/NotesCollection";

const insertNote = (notesText) => NotesCollection.insert({ text: notesText });

Meteor.startup(() => {});
