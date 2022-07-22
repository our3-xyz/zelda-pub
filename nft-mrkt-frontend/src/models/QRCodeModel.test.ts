import { QRNFTType, stringToType, typeToEmbeddedString } from "./QRCodeModel";
import { ethers } from "ethers";

describe("qr code utils", () => {
    test('qr code utils test', () => {
        const testStruct: QRNFTType = {
            address: "add",
            network: "net",
            tokenId: ethers.BigNumber.from(1000)
        }
        const expected = "network:net address:add token_id:1000"
        expect(typeToEmbeddedString(testStruct)).toEqual(expected)
    })

    test("to struct", () => {
        const testStruct: QRNFTType = {
            address: "add",
            network: "net",
            tokenId: ethers.BigNumber.from(1000)
        }
        const expected = "network:net address:add token_id:1000"
        expect(stringToType(expected)).toEqual(testStruct)
    })
})
