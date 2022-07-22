import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react'
import './form.scss'

function UploadImageForm() {

    const [fileImg, setFileImg] = useState<File | null>(null);
    const [imgHash, setImgHash] = useState<string>("");

    const sendFileToIPFS = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!fileImg) {
            return;
        }
        console.log("We have found a file", fileImg)
        try {
            const api_key = process.env.REACT_APP_PINATA_API_KEY
            const api_secret_key = process.env.REACT_APP_PINATA_API_SECRET_KEY

            if (api_key != null && api_secret_key != null) {
                const formData = new FormData();
                formData.append("file", fileImg);

                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        'pinata_api_key': api_key,
                        'pinata_secret_api_key': api_secret_key,
                        "Content-Type": "multipart/form-data"
                    },
                });

                const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
                setImgHash(ImgHash)
                console.log(ImgHash);
                //Take a look at your Pinata Pinned section, you will see a new file added to you list.
            } else {
                console.log("API Keys not found")
            }

        } catch (error) {
            console.log("Error sending File to IPFS: ")
            console.log(error)
        }
    }

    return(
        <div className="form">
            <form onSubmit={sendFileToIPFS}>
                <input type="file" onChange={(e) => setFileImg(e.target.files ? e.target.files[0] : null)} required />
                <button type='submit' >Upload Image</button>
            </form>
            <div>{imgHash}</div>
        </div>
    )
}

export default UploadImageForm
