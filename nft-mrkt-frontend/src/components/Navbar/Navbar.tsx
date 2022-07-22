import { MakeDispAddr } from "../../models/Address";
import React, { useState, useEffect } from 'react'
import { userStore } from "../../Store/userStore";
import Metamask from "../Assets/Metamask.svg";
import { Link } from "react-router-dom";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import LogoText from "../Assets/Logo-Text.png";
import { GetInstance } from "../../api/BackendIf";
import './navbar.scss'

const { ethereum } = window as any;

interface Maker {
  network: string;
  makerAddress: string;
  companyName: string;
  companyLogoUri: string;
}

const Navbar: React.FC = () => {

  const { user, setAddress, setAddressMaker } = userStore();
  const [dispAddr, setDispAddr] = useState<string>("");

  useEffect(() => {
    async function setStatus() {
      const backend = GetInstance();
      const response = await backend.getMaker(user.addrString);
      if(response.makerAddress.length < 10) {
        setAddressMaker(user.addrString, user.makerAddress, user.isMaker)
      } else{
        setAddressMaker(user.addrString, response.makerAddress, true)
      }
    }
    console.log("Admin's maker address: ",user.makerAddress);
    setStatus()
  }, [dispAddr])

  async function connectMM() {
    if(ethereum) {
      const web3Modal = new Web3Modal()
      const prov = new ethers.providers.Web3Provider(await web3Modal.connect())
      const signer = await prov.getSigner()
      const address = await signer.getAddress();
      setAddressMaker(address, user.makerAddress, user.isMaker);
      setDispAddr(MakeDispAddr(address))
    }
  }

  return (
    <div className='navbar' id="navbar">
      <div className='left'>
        <Link to="/" className='title'>
          <img src={LogoText} alt="Zelda Logo"></img>
        </Link>
      </div>
      <div className='right'>
        <Link to={"/consumer/" + user.addrString} className='consumerLink'> My Items </Link>
        {user?.addrString ?
          <button className='connectMMBtn'>
            <img src={Metamask} alt="metamask logo" ></img>
            {dispAddr}
          </button> :
          <button className='connectMMBtn' onClick={connectMM}>Connect Wallet</button>
        }
      </div>
    </div>
  )
}

export default Navbar
