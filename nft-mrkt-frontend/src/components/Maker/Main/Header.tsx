import React, { useState } from "react";
import "./main.scss";
import MintModal from "../Modal/MintModal";

interface HeaderProps {
    imageUri: string | undefined
    chosenLine: any | undefined//UPDATE
    name: string | undefined
    price: number | undefined
    count: number | undefined
    onSuccess: any
}

const Header: React.FC<HeaderProps> = ({ imageUri, chosenLine, name, price , count, onSuccess}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (<>
    <div className='header'>
        <div className='top'>
          <div className='headerWrapper'>
            <img src={imageUri} className='productImg' alt="product"></img>
          </div>
            <div className='headerWrapper'>
                <span className='headerTitle'>Address of line:</span>
                <span className='headerInfo'>{chosenLine}</span>
            </div>
            <div className='headerWrapper'>
                <span className='headerTitle'>Name of line:</span>
                <span className='headerInfo'>{name}</span>
            </div>
            <div className='headerWrapper'>
                <span className='headerTitle'>Price of Items:</span>
                <span className='headerInfo'>{price}</span>
            </div>
            <div className='headerWrapper'>
              <span className='headerTitle'>Current count:</span>
              <span className='headerInfo'>{count}</span>
            </div>
            <div className='headerWrapper'>
              <button className="createBtn" onClick={() => setIsOpen(true)}>
                Mint
              </button>
            </div>
        </div>
    </div>
      {isOpen ? <MintModal setIsOpen={setIsOpen} contractAddress={chosenLine} onSuccess={onSuccess}/> : <></>}
    </>
  )
}

export default Header
