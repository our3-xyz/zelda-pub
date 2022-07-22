import React, { useState } from "react";
import "./main.scss";
import { GetInstance } from "../../../api/BackendIf";
import { userStore } from "../../../Store/userStore";
import StoragePinataImpl from "../../../api/StoragePinataImpl";

const CreateMaker: React.FC = () => {
  const {user, setAddress, setAddressMaker} = userStore();
  const [name, setName] = useState<string | undefined>();

  const [fileImg, setFileImg] = useState<File | null>(null);
  const [imgURL, setImgURL] = useState<string>("");

  async function handleCreation() {
    if (name && fileImg) {
      const storage = new StoragePinataImpl();
      const cid = await storage.uploadFile(fileImg);
      const imgHash = `ipfs://${cid}`;
      const backend = GetInstance();
      const response = await backend.addMaker(name, imgHash, user.addrString);
      setAddressMaker(user.addrString, response.makerAddress, true);
      return response;
    } else {
      alert("name or image is empty");
    }
  }
  return (
    <div className="mainWrapper">
      <div className="topMain">
        <div className="indexHeader">Welcome to your future company dashboard</div>
      </div>
      <div className="bottomMain">
        { user.addrString !== "" ?
          <><form className="formWrapper">
            <div>
              <label>
                {" "}
                Company Name:&nbsp;
                <input
                  className="rightAlign"
                  placeholder="Wonka Industries"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                ></input>

              </label>
              <label>
                {" "}
                Company Logo:&nbsp;&nbsp;
                <input
                  className="rightAlign"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFileImg(e.target.files[0]);
                      setImgURL(URL.createObjectURL(e.target.files[0])
                      );
                    }
                  }
                  }
                  required
                />
                <img src={encodeURI(imgURL)} className="preview-image" />
              </label>
            </div>
          </form>
            <div className="actions">
              <div className="actionsContainer">
                <button className="createBtn" onClick={() => handleCreation()}>Create your account</button>
              </div>
            </div></> : <div>Please click connect!</div>}
      </div>
    </div>
  )
};

export default CreateMaker;
