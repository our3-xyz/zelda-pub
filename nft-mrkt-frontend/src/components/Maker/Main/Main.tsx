import React, { useEffect, useState } from "react";
import "./main.scss";
import { Token, GetInstance } from "../../../api/BackendIf";
import LineInfo from "./LineInfo/LineInfo";
import Header from "./Header";
import { userStore } from "../../../Store/userStore";
import NotFoundImg from "../../Assets/Logo.png";
import { GetIPFSGatewayPrefixedLink } from "../../../models/IPFSUtils";
import StoragePinataImpl from "../../../api/StoragePinataImpl";
import CreateMaker from "./CreateMaker";

interface MainProps {
  chosenLine: string;
}

const Main: React.FC<MainProps> = ({ chosenLine }) => {
  const {user, setAddress} = userStore();
  const [name, setName] = useState<string | undefined>();
  const [makerAddr, setMakerAddr] = useState<string>();
  const [productUri, setProductUri] = useState<string>();
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [tokens, setTokens] = useState<Token[]>();
  const backend = GetInstance();
  async function populate() {
    if (chosenLine) {
      const line = await backend.getCollectionData(chosenLine);
      if (line) {
        setName(line.productName);
        setMakerAddr(line.maker.makerAddress);
        setProductUri(line.productUri);
        setPrice(line.makerSalePrice.toNumber());
        setQuantity(line.numberProduced);
        setTokens(line.tokensMinted);
      }
    }
    setLoaded(true);
  }
  useEffect(() => {
    populate();
  }, [chosenLine]);


  if (chosenLine || user.isMaker === true) {
    if(chosenLine || price !== 0) {
      return (
        <div className="mainWrapper">
          <div className="topMain">
            <Header
              imageUri={productUri ? GetIPFSGatewayPrefixedLink(productUri) : NotFoundImg}
              chosenLine={chosenLine}
              name={name}
              price={price}
              count={tokens ? tokens.length : 0}
              onSuccess={()=> populate()}
            />
          </div>
          <div className="bottomMain">
            <div className="items">
              {tokens?.map((i) => (
                <LineInfo
                  key={i.id.toString()}
                  i={i}
                  chosenLine={chosenLine}
                />
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mainWrapper">
          <div className="topMain noLinesCreated">
            Thanks for creating your account!
          </div>
          <div className="bottomMain">
            <div className="items noLinesCreated">
              Please create a line to your left!
            </div>
          </div>
        </div>
      );
    }
  } else {
    return (<div>Hello world</div>);
  }
};

export default Main;
