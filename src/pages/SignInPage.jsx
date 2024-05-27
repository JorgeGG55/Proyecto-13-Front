import React from "react";
import Auth from "../components/Auth/Auth";
import Logo from "../components/Logo/Logo";
import styled from "styled-components";

const SignInPage = () => {
  return (
    <>
      <AuthContainer>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <Auth />
      </AuthContainer>
    </>
  );
};

const LogoContainer = styled.div`
  position: absolute;
  top: 100px;
`;

const AuthContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

export default SignInPage;
