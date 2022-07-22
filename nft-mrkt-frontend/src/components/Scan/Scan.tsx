import React from "react";
import "./Scan.scss";
import { useNavigate, useParams } from "react-router-dom";
import QrReader from "react-qr-reader";
import { stringToType } from "../../models/QRCodeModel";

export const MAKER_ADDRESS = "makerAddress";

const Scan: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const makerAddress = params[MAKER_ADDRESS];

  return <div className='scan-Wrapper'>
    <div className="scan-Wrapper-main">
      <div className="scan-Wrapper-row">
        {makerAddress? `Validating that product was made by maker ${makerAddress}` : "Hello"}
      </div>
        <div className="scan-qrCodeReader">
          <QrReader
            delay={300}
            onError={() => void {}}
            onScan={(data) => {
              if (data !== null) {
                console.log("scan", data);
                const qr = stringToType(data)
                navigate(`/itemDetail/${qr.address}/${qr.tokenId}`);
              }
            }}
            style={{ width: "40%" }}
          />
        </div>
    </div>
  </div>
}

export default Scan

