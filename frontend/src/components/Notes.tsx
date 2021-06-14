import React, {useEffect} from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listNotes } from "../graphql/queries";
import { useState } from 'react';
import { Button, Paper } from '@material-ui/core';
import { deleteNote } from '../graphql/mutations';

type getNotesQuery = {
    listNotes: {[key: string]: any}[];
};

type deleteNoteMutation = {
    deleteIndexNote: string
};

const Notes = () => {

    const [notes, setNotes] = useState<{[key: string]: any}[]>([]);

    useEffect(() => {
        const fetchNotes = async () => {
          try {
            const data = (await API.graphql(graphqlOperation(listNotes))) as {
                data: getNotesQuery
            };
            const notesData = data.data.listNotes;
            setNotes(notesData)
          } catch (err) {
            console.log(err)
          }
          
          
        };
        fetchNotes();
      }, []);

    const deleteThisNote = async (index: number) => {
        try {
            const noteToDelete = notes[index];
            const noteIndex = noteToDelete['id'];
            await API.graphql(graphqlOperation(deleteNote, {noteId: noteIndex})) as {
                data: deleteNoteMutation
            };
            const newNoteList = notes.filter((note, idx) => idx !== index);
            setNotes(newNoteList)
        } catch (err) {
            console.log("Error deleting note: ", err)
        }
    };

    const updateComplete = async (index: number) => {
        try {
            const upDateNote = notes[index];
            console.log(upDateNote)
        } catch (err) {
            console.log("Error updating note: ", err);
        }
    };

    return (
        <div>
            {notes.map((note, idx) => 
                <div key={idx.toString()} style={{width: "25vw"}}>
                    <Paper variant="outlined" elevation={2}>
                        <p>Name: {note.name}</p>
                        <p>Completed: {note.completed.toString()}</p>
                        <Button onClick={() => updateComplete(idx)} variant="contained" color="primary">Mark {note.completed ? "Incomplete" : "complete"}</Button>
                        <Button onClick={() => deleteThisNote(idx)} variant="contained" color="secondary">Delete</Button>
                    </Paper>
                </div>
            )}
        </div>
    );
};

export default Notes;