/* tslint:disable */
/* eslint-disable */

import gql from "graphql-tag";

export const deleteNote = gql`
    mutation deleteNote($noteId: String!) {
        deleteNote(noteId: $noteId)
    }
`

export const createNote = gql`
    mutation createNote($name: String!) {
        createNote(name: $name)
    }
`
