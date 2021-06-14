/* tslint:disable */
/* eslint-disable */

import gql from "graphql-tag";

export const listNotes = gql`
    query ListNotes {
        listNotes {
            id
            name
            completed
        }
    } 
`
    