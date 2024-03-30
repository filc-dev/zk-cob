"use client";
import { useEffect } from "react";
import { useWallet } from "../../hooks/use-wallet";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import Link from "next/link";
import { Logo } from "./logo";

interface HeaderProps {}

export const Header = (props: HeaderProps) => {
  const { wallet, initializeWallet, observeWalletChange, connectWallet } =
    useWallet();
  const { toast } = useToast();

  useEffect(() => {
    initializeWallet();
    observeWalletChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (e) {
      const error = e as Error;

      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: error.message,
      });
    }
  };
  return (
    <div className="w-full h-14 flex justify-between items-center sticky top-0 z-10 px-4 border-b bg-background">
      <Link className="text-lg font-semibold text-primary" href="/">
        <Logo width={90} />
      </Link>
      {wallet ? (
        <Link href="/register">
          <Button variant="secondary">Create Pool</Button>
        </Link>
      ) : (
        <Button variant="secondary" onClick={handleConnectWallet}>
          {"Connect Wallet"}
        </Button>
      )}
    </div>
  );
};
