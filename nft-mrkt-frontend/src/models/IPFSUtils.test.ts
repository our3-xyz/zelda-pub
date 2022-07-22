import { GetIPFSGatewayPrefixedLink } from "./IPFSUtils";

describe("ipfs utils utils", () => {
  test('ipfs utils test', () => {
    let test = "http://hello/123"
    let actual = GetIPFSGatewayPrefixedLink(test)
    expect(actual).toEqual(test)

    test = "ipfs://hello/123"
    let expected = "https://gateway.pinata.cloud/ipfs/hello/123"
    actual = GetIPFSGatewayPrefixedLink(test)
    expect(actual).toEqual(expected)

    test = "iPFs://hello/123"
    expected = "https://gateway.pinata.cloud/ipfs/hello/123"
    actual = GetIPFSGatewayPrefixedLink(test)
    expect(actual).toEqual(expected)
  })
})
