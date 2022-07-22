import React, { useEffect, useState } from "react";
import "./maker.scss";
import { userStore } from "../../Store/userStore";
import { GetInstance, Maker } from "../../api/BackendIf";
import Modal from "./Modal/Modal";
import Main from "./Main/Main";
import "./maker.scss";
import { MakeDispAddr } from "../../models/Address";
import NotFoundImg from "../Assets/Logo.png";
import CreateMaker from "./Main/CreateMaker";
import { Link } from "react-router-dom";
import { GetIPFSGatewayPrefixedLink } from "../../models/IPFSUtils";

const MakerComponent: React.FC = () => {
  const { user } = userStore();

  const [makerInfo, setMakerInfo] = useState<Maker>();
  const [makerCollections, setMakerCollections] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [logo, setLogo] = useState<string | undefined>("");
  const [chosenLine, setChosenLine] = useState<any>("");
  const backend = GetInstance();

  useEffect(() => {
    async function getInfo() {
      const _makerInfo = await backend.getMaker(user.addrString);
      setMakerInfo(_makerInfo);
    }
    getInfo();
  }, []);

  useEffect(() => {
    async function setLogoUri() {
      const collections = await backend.getMakerData();
      setMakerCollections(collections);
      const logoUrl = makerInfo?.companyLogoUri;
      await setLogo(logoUrl);
    }
    setLogoUri();
  }, [makerInfo, isOpen]);
 if(user.addrString !== "" && user.isMaker) {
  return (
    <div className="maker">
      <div className="sidebar toplevel">
        <div className="sideTop">
          <h3 className="makerName">
            {makerInfo?.companyName}
          </h3>
          <img src={makerInfo?.companyLogoUri} className="makerImg" alt="company logo"></img>
          <Link to={`/scan/${user.addrString}`}>Your customer validation link</Link>
        </div>
        <div className="sideBottom">
          <div className="productLines">
            {makerCollections?.map((i, index) => (
              <div
                key={i}
                className="line x"
                data-address={i}
                onClick={(e) =>
                  setChosenLine(e.currentTarget.dataset.address)
                }
              >
                {MakeDispAddr(i)}
              </div>
            ))}
            <button className="addLine" onClick={() => setIsOpen(true)}>
              Add line +{" "}
            </button>
            {isOpen && <Modal setIsOpen={setIsOpen} />}
          </div>
        </div>
      </div>
      <div className="main toplevel">
        <Main chosenLine={chosenLine} />
      </div>
    </div>
  );
 } else {
  return (
    <div className="maker">
      <div className="sidebar toplevel">
        <div className="sideTop">
          <h3 className="makerName">Your Company</h3>
          <img
            src={NotFoundImg}
            className="makerImg"
            alt="company logo"
          ></img>
        </div>
      </div>
      <div className="main toplevel">
        <CreateMaker/>
      </div>
    </div>
  );
 }
};

export default MakerComponent;
