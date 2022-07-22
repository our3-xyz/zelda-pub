import { MakeDispAddr } from "./Address";

test("qr code utils test", () => {
  const actual = MakeDispAddr("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")
  const expected = "0xf3...2266"
  expect(actual).toEqual(expected)
});
