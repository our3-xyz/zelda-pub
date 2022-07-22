import React, { useState } from "react";
import styles from "./Modal.module.scss";
import "./Modal.scss";
import { GetInstance } from "../../../api/BackendIf";
import StoragePinataImpl from "../../../api/StoragePinataImpl";
import Confirm from "./Confirm";
import { ethers } from "ethers";
import { userStore } from "../../../Store/userStore";

interface ModalProps {
  setIsOpen: any
}

const Modal: React.FC<ModalProps> = ({ setIsOpen }) => {
  let initialFieldNames = ["color", "size", "material"];
  let initialFieldValues = ["", "", ""];

  const { user, setAddress, setAddressMaker } = userStore();
  const [fieldNames, setFieldNames] = useState(initialFieldNames);
  const [fieldValues, setFieldValues] = useState(initialFieldValues);
  const [fileImg, setFileImg] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [imgURL, setImgURL] = useState<string>("");
  const storage = new StoragePinataImpl();

  async function handleCreation() {
    if (name === "") {
      alert("name cannot be empty");
      return;
    }
    let imgHash = "";
    if (fileImg) {
      const cid = await storage.uploadFile(fileImg);
      imgHash = `ipfs://${cid}`;
    }

    let ipfsHash = "";
    if (fieldNames.length > 0) {
      const cid = await storage.uploadAsJsonPairs(fieldNames, fieldValues);
      ipfsHash = `ipfs://${cid}`;
    }

    const backend = GetInstance();
    const response = await backend.addCollectionContract(
      name,
      user.addrString,
      imgHash,
      ipfsHash,
      ethers.BigNumber.from(price),
      quantity
    );
    setContractAddress(response.contractAddress);
    setConfirmOpen(true);
  }

  return (
    <>
      <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>Add Product Line</h5>
          </div>
          <div className={styles.modalContent}>
            <form className={styles.modalForm}>
              <div className={styles.stndrdInputs}>
                <label> Product Name:&nbsp;
                  <input className={styles.rightAlign} placeholder="Golden Ticket" type="text" onChange={e => setName(e.target.value)}></input>
                </label>
                <label> Product Price:&nbsp;&nbsp;
                  <input className={styles.rightAlign} placeholder="$99" type="number" onChange={e => setPrice(parseInt(e.target.value))}></input>
                  {/* I could only make this work with parseInt... any thoughts? */}
                </label>
                <label> Quantity:&nbsp;
                  <input className={styles.rightAlign} placeholder="100" type="number" onChange={e => setQuantity(parseInt(e.target.value))}></input>
                  {/* I could only make this work with parseInt... any thoughts? */}
                </label>
                <label> Product Image:&nbsp;&nbsp;
                  <input className={styles.rightAlign} type="file" onChange={
                    (e) => {
                      if (e.target.files) {
                        setFileImg(e.target.files[0]);
                        setImgURL(URL.createObjectURL(e.target.files[0]));
                      }
                    }} required />
                </label>
                <img src={encodeURI(imgURL)} className="modal-preview-image" />

              </div>
            </form>
          </div>
          <div className={styles.modalActions}>
            <div className={styles.actionsContainer}>
              <button className={styles.deleteBtn} onClick={() => handleCreation()}>
                Create Product Line
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      {confirmOpen && <Confirm address={contractAddress} toggle={() => {
        setIsOpen(false);
      }} />}
    </>
  );
};

export default Modal;
