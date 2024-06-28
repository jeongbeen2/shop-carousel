// src/ProductCard.jsx
import React from 'react';
import styled from '@emotion/styled';

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;

  @media (max-width: 768px) {
    height: 150px;
  }
`;

const Name = styled.h3`
  margin: 8px 0;
  font-size: 18px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Price = styled.p`
  font-weight: bold;
  color: #007aff;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ProductCard = ({ product }) => (
  <Card>
    <Image src={product.image} alt={product.name} />
    <Name>{product.name}</Name>
    <Price>{product.price.toLocaleString()}원</Price>
  </Card>
);

export default ProductCard;