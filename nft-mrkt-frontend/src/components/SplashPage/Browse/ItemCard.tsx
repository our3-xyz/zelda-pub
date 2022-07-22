import { ethers } from "ethers";
import React from "react";
import { Token, GetInstance } from "../../../api/BackendIf";
import { useNavigate } from "react-router-dom";
import NotFoundImg from "../../Assets/Logo.png";
import { MakeDispAddr } from "../../../models/Address";

interface ItemCardProps {
  i: Token;
  forSale: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({i, forSale}) => {

  const price = i.salePrice.toNumber();

  async function purchase(_address: string, _token: ethers.BigNumber) {
    const backend = GetInstance();
    const response = backend.buyNFT(_address, _token);
    console.log(response);
  }
  const navigate = useNavigate();
  return (
    <div className="itemCardWrapper">
      <div className="left">
        <img src={i.contract.productUri.startsWith("http") ? i.contract.productUri : NotFoundImg} alt="placeholder img"/>
        {forSale && <button className='purchase title' data-testid="purchase-button" onClick={() => purchase(i.contract.contractAddress, i.id)}>Purchase</button>}
      </div>
      <div className="right">
        <div className='data'>
            <span className='name title'>Name:</span>
            <span className='info nameinfo'>{i.contract.productName}</span>
            <span className='owner title'>Owner:</span>
            <span className='info ownerinfo'>{MakeDispAddr(i.ownerAddress)}</span>
            <span className='price title'>Price:</span>
            <span className='info priceinfo'>{price} ether</span>
            <button className="detailLink" data-testid="item-details-link" onClick={() => {
              navigate("/itemDetail", { state: { data: i } });
            }} >View details</button>
            {/* NEED TO ADD: FOR SALE,  */}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
