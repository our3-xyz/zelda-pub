import React from 'react'
import {useLocation} from "react-router-dom";
import './qrReadResult.scss'

export type QRReadResultType  = {
    data: string
}

const QRReadResult: React.FC <{data?:string}> = ({data}) =>{
    const location = useLocation();
    let locData = location.state as QRReadResultType
    return (<div className="qrCodeResult">
        <p>The qr data read </p><p>{locData ? locData.data : "nothing"}</p></div>)
}

export default QRReadResult
