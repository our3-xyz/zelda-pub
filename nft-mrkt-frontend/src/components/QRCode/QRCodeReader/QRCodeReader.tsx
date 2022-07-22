import React, {useState} from 'react'
import QrReader from "react-qr-reader";
import {useNavigate} from "react-router-dom";
import {QRReadResultType} from "../QRReadResult/QRReadResult";
import './qrCodeReader.scss'

function QRCodeReader() {
    const navigate = useNavigate();
    return (
        <div className="qrCodeReader">
            <QrReader
            delay={300}
            onError={() => void {}}
            onScan={(data) => {
                if (data !== null) {
                    console.log(data)
                    let request: QRReadResultType = {data:data}
                    navigate("/qr-read-result" , {
                        state: request
                    })
                }
            }}
            style={{width: '30%'}}
            />;
        </div>
    )
}

export default QRCodeReader
