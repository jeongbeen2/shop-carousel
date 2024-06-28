// src/Header.jsx
import React from 'react';
import styled from '@emotion/styled';

const HeaderContainer = styled.header`
  background-color: #007aff;
  color: white;
  padding: 1rem;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
`;

const Header = () => (
  <HeaderContainer>
    <Title>남성 의류 쇼핑몰</Title>
  </HeaderContainer>
);

export default Header;