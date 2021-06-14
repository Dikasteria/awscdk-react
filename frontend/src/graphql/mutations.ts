/* tslint:disable */
/* eslint-disable */

import gql from "graphql-tag";

export const deleteNote = gql`
    mutation deleteNote($noteId: String!) {
        deleteNote(noteId: $noteId)
    }
`
export const updateNote = gql`
    mutation updateNote($note: UpdateNoteInput!) {
        updateNote(note: $note) {
            id 
            name
            completed
        }
    }
`

export const createNote = gql`
    mutation createNote($note: NoteInput!) {
        createNote(note: $note) {
            id
            name
            completed
        }
    }
`