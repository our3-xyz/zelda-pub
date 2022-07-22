import React, { useEffect, useState } from "react";
import "./itemDetail.scss";
import { Location, Params, useLocation, useParams } from "react-router-dom";
import { BackendAPI, Token, GetInstance } from "../../api/BackendIf";
import { BigNumber, ethers } from "ethers";
import NotFoundImg from "../Assets/Logo.png";
import { GetIPFSGatewayPrefixedLink } from "../../models/IPFSUtils";
import QRGenerator from "../QRCode/QRGenerator/QRGenerator";
import { userStore } from "../../Store/userStore";

export const CONTRACT_ADDRESS_PARAM = "contractAddress";
export const TOKEN_ID_PARAM = "tokenID"
export const MAKER_ADDRESS_PARAM = "makerAddress"

export type ItemDetailInput = {
  data: Token
}

interface ItemDetailProps {
  api?: () => BackendAPI
}

const ItemDetail: React.FC<ItemDetailProps> = ({api= GetInstance}) => {
  const [item, setItem] = useState<Token>();
  const [validation, setValidation] = useState("");
  const params = useParams();
  const location = useLocation();

  async function getItem(params: Params, location: Location) {

    const contractAddress = params[CONTRACT_ADDRESS_PARAM];
    const tokenID = params[TOKEN_ID_PARAM];
    const makerAddress = params[MAKER_ADDRESS_PARAM];

    if ((contractAddress !== undefined) && (tokenID !== undefined)) {
      const backend = api()
      const tokenIDInt = parseInt(tokenID);
      const data = await backend.getTokenDetail(contractAddress, tokenIDInt);
      const t: Token = {
        contract: {
          contractAddress: data.contractAddress,
          maker: {
            companyName: "",
            companyLogoUri: "",
            network: "",
            userAddress: "",
            makerAddress: "",
          },
          makerSalePrice: ethers.BigNumber.from(0),
          productUri: data.image ?? "",
          productName: data.name,
          productMeta: data.description || "",
          numberProduced: 0
        },
        forSale: false,
        id: BigNumber.from(tokenID),
        minted: true,
        ownerAddress: data.ownerAddress,
        salePrice: BigNumber.from(0)
      };
      setItem(t);
      if (makerAddress !== undefined) {
        const ownerAddress = await backend.getContractOwner(contractAddress);
        if (ownerAddress === makerAddress) {
          setValidation("This is an authentic token!")
        } else {
          setValidation("Cannot authenticate")
        }
      }
      return;
    }
    let locData = location.state as ItemDetailInput;
    const t = locData.data;
    t.salePrice = BigNumber.from(t.salePrice._hex);
    setItem(t);
    return;
  }

  useEffect(() => {
    getItem(params, location);
  }, []);
  if (!item) {
    return(<></>)
  }
  return (
  <div className='itemDetailWrapper'>
    <div className="itemDetailWrapper-main">
      <div className="itemDetailWrapper-row validating">
      {params[MAKER_ADDRESS_PARAM] ? validation : ""}
      </div>
      <div className="itemDetailWrapper-row title">
        {item.erc721Data?.name || item.contract.productName}
      </div>
      <div className="itemDetailWrapper-row">
        <img src={GetIPFSGatewayPrefixedLink(item.erc721Data?.image ?? item.contract.productUri).startsWith("http") ? GetIPFSGatewayPrefixedLink(item.erc721Data?.image ?? item.contract.productUri) : NotFoundImg} className='itemDetailWrapper-img' alt="product" />
      </div>
      <div className="itemDetailWrapper-row">
        <div className="itemDetailWrapper-left">
          Contract Address:
        </div>
        <div className="itemDetailWrapper-right">
          {item.contract.contractAddress}
        </div>
      </div>
      <div className="itemDetailWrapper-row">
        <div className="itemDetailWrapper-left">
          Desc:
        </div>
        <div className="itemDetailWrapper-right">
          {item.erc721Data?.description}
        </div>
      </div>
      <div className="itemDetailWrapper-row">
        <QRGenerator size={300} data={{
          network: "polygon",
          address: item.contract.contractAddress,
          tokenId: item.id,
        }} />
      </div>
    </div>
    <div className='body'>
    </div>
  </div>);
};

export default ItemDetail

