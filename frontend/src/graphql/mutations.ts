/* tslint:disable */
/* eslint-disable */

import gql from "graphql-tag";

export const deleteNote = gql`
    mutation deleteNote($noteId: String!) {
        deleteNote(noteId: $noteId)
    }
`

