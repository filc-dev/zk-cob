import { ReactNode } from "react";
import { Header } from "./header";

interface LayoutProps {
  children: ReactNode;
}
export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="max-w-2xl mx-auto relative">
      <Header />
      <div className="px-4">{children}</div>
    </div>
  );
};
