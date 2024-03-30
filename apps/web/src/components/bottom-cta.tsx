import { ReactNode } from "react";

interface BottomCtaProps {
  children: ReactNode;
}
export const BottomCta = ({ children }: BottomCtaProps) => {
  return <div className="sticky bottom-0 py-4 bg-background">{children}</div>;
};
