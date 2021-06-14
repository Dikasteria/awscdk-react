import React, { useState } from 'react';

const CreateNote = () => {

    const [data, setData] = useState<{[key: string]: any}>({});

    const handleChange = (e:any) => {
        const {name, value} = e.target;
        setData({[name]: value})
    };

    const submitForm = async (e: any) => {
        e.preventDefault();
        

    };

    return (
        <div>
            <h1>Create New Note</h1>
            <form onSubmit={(e) => submitForm(e)}>
                <input 
                type="text" 
                placeholder="Name"
                value={data?.name}
                onChange={(e) => handleChange(e)}
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default CreateNote;