import React from "react";
import Navbar from "./Navbar";
import { Wrapper, WrapperVariant } from "./Wrapper";

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <Navbar pageProps />
      <Wrapper variant={variant ? "regular" : variant}>{children}</Wrapper>
    </>
  );
};
