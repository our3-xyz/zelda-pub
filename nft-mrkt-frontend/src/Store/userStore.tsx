import create from "zustand";

import { User } from "../models/User";

interface UserState {
  user: User
  setAddress: (addrString: string) => void
  setAddressMaker: (_polyAddress: string, _makerAddress: string, _isMaker: boolean) => void
}

export const userStore = create<UserState>((set) => ({
  // initial state
  user: {network: "", addrString: "", isMaker: false, makerAddress: "" },
  // methods for manipulating state
  setAddress: (polyAddress: string) => {
    set((state) => ({
      user: {network: "polygon", addrString: polyAddress, isMaker: false, makerAddress: "" }
    }));
  },
  setAddressMaker: (_polyAddress: string, _makerAddress: string, _isMaker: boolean) => {
    set((state) => ({
      user: {network: "polygon", addrString: _polyAddress, makerAddress: _makerAddress, isMaker: _isMaker}
    }));
  }
}));
