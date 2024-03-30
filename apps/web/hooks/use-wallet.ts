import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface WalletState {
  wallet?: string;
  initializeWallet: () => Promise<void>;
  connectWallet: () => Promise<void>;
  observeWalletChange: () => void;
}

export const useWallet = create<WalletState, [["zustand/immer", never]]>(
  immer((set) => ({
    async initializeWallet() {
      if (typeof mina === "undefined") {
        throw new Error("Auro wallet not installed");
      }

      const [wallet] = await mina.getAccounts();

      set((state) => {
        state.wallet = wallet;
      });
    },
    async connectWallet() {
      if (typeof mina === "undefined") {
        throw new Error("Auro wallet not installed");
      }

      const [wallet] = await mina.requestAccounts();

      set((state) => {
        state.wallet = wallet;
      });
    },
    observeWalletChange() {
      if (typeof mina === "undefined") {
        throw new Error("Auro wallet not installed");
      }

      mina.on("accountsChanged", ([wallet]) => {
        set((state) => {
          state.wallet = wallet;
        });
      });
    },
  }))
);
