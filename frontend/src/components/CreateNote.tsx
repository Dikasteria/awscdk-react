import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import {createNote} from "../graphql/mutations";

type createNoteMutation = {
    createNote: {[key: string]: any}
};

interface Props {
    setNotes: Function,
    notes: {[key: string]: any}[]
};

const CreateNote = ({setNotes, notes}: Props) => {

    const [data, setData] = useState<{[key: string]: any}>({name: ""});
    
    const handleChange = (e:any) => {
        const {name, value} = e.target;
        setData({[name]: value})
    };

    const submitForm = async (e: any) => {
        e.preventDefault();

        try {
            const newNote = {
                name: data?.name,
                id: "21234234hffghfg" + (Math.random() * 12).toString(),
                completed: "false"
            };
            
            const resp = await API.graphql(graphqlOperation(createNote, {note: newNote})) as {
                data: createNoteMutation
            };
            const noteToAddtoArr = resp.data.createNote
            const updatedNotesArray = [...notes, noteToAddtoArr];
            setNotes(updatedNotesArray);
            setData({name: ""});
        } catch (err) {
            console.log("Error adding new note", err)
        };
    };

    return (
        <div>
            <h1>Create New Note</h1>
            <form onSubmit={(e) => submitForm(e)}>
                <input 
                type="text"
                name="name"
                placeholder="Name"
                value={data.name}
                onChange={(e) => handleChange(e)}
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default CreateNote;