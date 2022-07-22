import React, { useState } from "react";
import styles from "./Modal.module.scss";
import "./Modal.scss";
import { GetInstance } from "../../../api/BackendIf";
import StoragePinataImpl from "../../../api/StoragePinataImpl";
import Confirm from "./Confirm";

interface ModalProps {
  setIsOpen: any
  contractAddress: string
  onSuccess: any
}

const MintModal: React.FC<ModalProps> = ({ setIsOpen, contractAddress, onSuccess }) => {
  const [fileImg, setFileImg] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [imgURL, setImgURL] = useState<string>("");

  const storage = new StoragePinataImpl();

  async function handleCreation() {
    if (name === "" || desc == "") {
      alert("name and description cannot be empty");
      return;
    }
    let keys = ["name", "description"];
    let values = [name, desc]
    if (fileImg) {
      const cid = await storage.uploadFile(fileImg);
      const imgHash = `ipfs://${cid}`;
      keys.push("image");
      values.push(imgHash);
    }
    const cid = await storage.uploadAsJsonPairs(keys, values);
    const ipfsHash = `ipfs://${cid}`;
    const backend = GetInstance();
    const tokenId = await backend.makerMint(
      contractAddress,
      ipfsHash
    );
    setConfirmOpen(true);
    onSuccess()
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
                <label> Name:&nbsp;
                  <input className={styles.rightAlign} placeholder="Golden Ticket" type="text" onChange={e => setName(e.target.value)}></input>
                </label>
                <label> Description:&nbsp;
                  <input className={styles.rightAlign} placeholder="Golden Ticket" type="text" onChange={e => setDesc(e.target.value)}></input>
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
                Mint
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

export default MintModal;
