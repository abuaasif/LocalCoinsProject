import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";

const Nav = styled.div`
  background: #05144c;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: fixed; /* Add fixed position */
  width: 100%; /* Set the width to 100% */
  top: 0; /* Align to the top of the viewport */
  z-index: 1000; /* Ensure it's above other content */
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #05144c;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 70px;
  left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const IconWrapper = styled.div`
  svg {
    color: white; /* Default icon color */
    transition: color 0.3s ease;
  }

  &:hover svg {
    color: black; /* Icon color on hover */
  }
`;

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(true);

  return (
    <>
      <Nav>
        <h1
          style={{
            textAlign: "center",
            marginLeft: "19px",
            color: "white",
            fontSize:"30px",
          }}
        >
          LOCALCOINS
        </h1>
      </Nav>
      <SidebarNav sidebar={sidebar}>
        <SidebarWrap>
          {SidebarData.map((item, index) => (
            <SubMenu item={item} key={index}>
              <IconWrapper>{item.icon}</IconWrapper>
            </SubMenu>
          ))}
        </SidebarWrap>
      </SidebarNav>
    </>
  );
};

export default Sidebar;
