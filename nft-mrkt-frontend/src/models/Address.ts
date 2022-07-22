export function MakeDispAddr(numAddr: string): string {
  const strAddr = numAddr.toString();
  const first = strAddr.slice(0,4);
  const last = strAddr.slice(-4);
  return `${first}...${last}`;
}
