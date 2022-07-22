import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react'
import './form.scss'

function UploadJSONDataForm() {

    let initialFieldNames = ["name", "description", "price"]
    let initialFieldValues = ["", "", ""]

    const [fieldNames, setFieldNames] = useState(initialFieldNames);
    const [fieldValues, setFieldValues] = useState(initialFieldValues);

    const [ipfsHash, setIpfsHash] = useState<string>("");

    const addField = () => {
        const thisFieldNames = fieldNames.slice()
        const thisFieldValues = fieldValues.slice()
        console.log(thisFieldNames, thisFieldValues)
        let defaultKey = "key"
        let defaultValue = ""
        let originalLength = thisFieldNames.length

        thisFieldNames[originalLength + 1] = defaultKey
        thisFieldValues[originalLength + 1] = defaultValue

        if (thisFieldNames.length !== thisFieldValues.length) {
            alert("Arrays aren't equal!!!")
            console.log(thisFieldNames, thisFieldValues)
        }
        setFieldNames(thisFieldNames)
        setFieldValues(thisFieldValues)
    }

    const removeField = (event: React.FormEvent, index: number) => {
        const thisFieldNames = fieldNames.slice()
        const thisFieldValues = fieldValues.slice()
        thisFieldNames.splice(index, 1)
        thisFieldValues.splice(index, 1)

        if (thisFieldNames.length !== thisFieldValues.length) {
            alert("Arrays aren't equal!!!")
        }
        setFieldNames(thisFieldNames)
        setFieldValues(thisFieldValues)
    }

    const handleFormChange = (event: React.FormEvent<HTMLInputElement>, index: number) => {
        console.log("new f:", fieldNames, fieldValues)

        const thisFieldNames = fieldNames.slice()
        const thisFieldValues = fieldValues.slice()

        let newContent = event.currentTarget.value
        let className = event.currentTarget.className
        if (className == "key") {
            thisFieldNames[index] = newContent
        } else if (className == "value") {
            thisFieldValues[index] = newContent
        }

        if (thisFieldNames.length !== thisFieldValues.length) {
            alert("Arrays aren't equal!!!")
        }
        setFieldNames(thisFieldNames)
        setFieldValues(thisFieldValues)
        console.log("new f:", fieldNames, fieldValues)
    }

    const submit = (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        console.log(fieldNames, fieldValues)
    }


    const sendJSONToIPFS = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (fieldNames.length !== fieldValues.length) {
            alert("Arrays aren't equal!!!")
        }
        if (e.currentTarget.id !== 'final_submit') {
            console.log("not final submit button")
            return
        }

        try {
            const api_key = process.env.REACT_APP_PINATA_API_KEY
            const api_secret_key = process.env.REACT_APP_PINATA_API_SECRET_KEY

            if (api_key != null && api_secret_key != null) {

                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                    headers: {
                        'pinata_api_key': api_key,
                        'pinata_secret_api_key': api_secret_key,
                        "Content-Type": "application/json"
                    },
                    data: {fieldNames, fieldValues}
                });

                const ipfsHash = `ipfs://${resFile.data.IpfsHash}`;
                setIpfsHash(ipfsHash)
                console.log(ipfsHash);
            } else {
                console.log("API Keys not found")
            }

        } catch (error) {
            console.log("Error sending File to IPFS: ")
            console.log(error)
        }
    }

    // @ts-ignore
    return(<div className="form">
            <form onSubmit={submit}>
                {fieldNames.map((key: string, i: number)=>{
                    return (
                        <div key={i}>
                            <input className='key'
                                   name={key}
                                   placeholder={key}
                                   value={key}
                                   onChange={(event:React.FormEvent<HTMLInputElement>) => handleFormChange(event, i)}
                                   />
                            <input className='value'
                                   name={key}
                                   placeholder='value'
                                   value={fieldValues[i]}
                                   onChange={(event:React.FormEvent<HTMLInputElement>) => handleFormChange(event, i)}
                            />
                            <button id='remove_field' onClick={(event:React.FormEvent) => removeField(event, i)}>Remove field</button>
                        </div>
                    )
                })}
            </form>
            <button onClick={addField}>Add a Field</button>
            <button id='final_submit' onClick={sendJSONToIPFS}>Submit</button>
            <div>{ipfsHash}</div>
        </div>)
}

export default UploadJSONDataForm
