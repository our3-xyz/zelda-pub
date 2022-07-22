import axios from "axios";
import { StorageIf } from "./StorageIf";

class StoragePinataImpl implements StorageIf {
  private readonly api_key: string;
  private readonly api_secret_key: string;

  constructor() {
    if (!process.env.REACT_APP_PINATA_API_KEY || process.env.REACT_APP_PINATA_API_KEY === "") {
      throw new Error("no pinata api key");
    } else {
      this.api_key = process.env.REACT_APP_PINATA_API_KEY;
    }
    if (!process.env.REACT_APP_PINATA_API_SECRET_KEY || process.env.REACT_APP_PINATA_API_SECRET_KEY === "") {
      throw new Error("no pinata secret key");
    } else {
      this.api_secret_key = process.env.REACT_APP_PINATA_API_SECRET_KEY;
    }
  }

  async uploadAsJsonPairs(
    keys: string[],
    values: string[]
  ): Promise<string> {
    if (keys.length !== values.length) {
      throw new Error("keys and values are not of same length")
    }
    let obj: {[k: string]: any} = {};
    for (let i = 0; i < keys.length ; i++) {
      obj[keys[i]] = values[i];
    }

    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      headers: {
        "pinata_api_key": this.api_key,
        "pinata_secret_api_key": this.api_secret_key,
        "Content-Type": "application/json"
      },
      data: obj
    });
    return resFile.data.IpfsHash;
  }

  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        "pinata_api_key": this.api_key,
        "pinata_secret_api_key": this.api_secret_key,
        "Content-Type": "multipart/form-data"
      }
    });
    return resFile.data.IpfsHash;
  }
}

export default StoragePinataImpl;
