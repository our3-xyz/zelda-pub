import React from 'react'
import {QRCodeSVG} from 'qrcode.react';
import {QRNFTType, typeToEmbeddedString} from '../../../models/QRCodeModel';

const QRGenerator: React.FC <{data?:QRNFTType, size?:number}> = ({data, size}) =>{
    return (
      <>
          {data ? <QRCodeSVG size={size} value={typeToEmbeddedString(data)} /> : "no data"}
      </>
    )
}

export default QRGenerator
