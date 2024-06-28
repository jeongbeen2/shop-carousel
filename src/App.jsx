// src/App.jsx
import React from 'react';
import styled from '@emotion/styled';
import Header from './Header';
import InfiniteCarousel from './InfiniteCarousel';
import { products } from './data';
import { Global, css } from '@emotion/react';

const globalStyles = css`
  body {
    margin: 0;
    padding: 0;
    font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const MainContainer = styled.main`
  max-width: 1920px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 1rem;
  }
`;

function App() {
  const extendedProducts = [...products, ...products];
  
  return (
    <>
      <Global styles={globalStyles} />
      <Header />
      <MainContainer>
        <SectionTitle>인기 상품</SectionTitle>
        <InfiniteCarousel items={products} />
      </MainContainer>
    </>
  );
}

export default App;