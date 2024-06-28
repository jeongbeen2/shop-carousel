import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import ProductCard from './ProductCard';

const MOBILE_BREAKPOINT = 768;
const AUTO_SCROLL_INTERVAL = 3000; // 3초

const CarouselContainer = styled.div`
  width: 100%;
  max-width: 1920px;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 18px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const CarouselTrack = styled.div`
  display: flex;
  transition: transform 0.3s ease;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const CarouselItem = styled.div`
  flex: 0 0 calc(100% / 6); // Show 6 items on largest screen
  max-width: 300px;
  padding: 10px;
  box-sizing: border-box;

  @media (max-width: 1600px) {
    flex: 0 0 calc(100% / 5); // Show 5 items
  }

  @media (max-width: 1280px) {
    flex: 0 0 calc(100% / 4); // Show 4 items
  }

  @media (max-width: 1024px) {
    flex: 0 0 calc(100% / 3); // Show 3 items
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    flex: 0 0 calc(100% / 2); // Show 2 items on mobile
    max-width: none;
  }
`;

const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 10;

  &:first-of-type {
    left: 10px;
  }

  &:last-of-type {
    right: 10px;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    display: none;
  }
`;

const InfiniteCarousel = ({ items }) => {
  const trackRef = useRef(null);
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const itemWidth = trackRef.current ? trackRef.current.children[0].offsetWidth : 0;
  const totalWidth = items.length * itemWidth;

  const resetAutoScroll = useCallback(() => {
    setAutoScrollEnabled(false);
    setTimeout(() => setAutoScrollEnabled(true), AUTO_SCROLL_INTERVAL);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - position);
    resetAutoScroll();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - startX;
    setPosition(x);
  };

  const handleScroll = (direction) => {
    const newPosition = position + (direction === 'left' ? itemWidth : -itemWidth);
    setPosition(newPosition);
    resetAutoScroll();
  };

  useEffect(() => {
    const track = trackRef.current;
    if (track) {
      track.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        track.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isDragging, position, startX, handleMouseDown, handleMouseUp, handleMouseMove]);

  useEffect(() => {
    let animationFrame;
    const autoScroll = () => {
      if (autoScrollEnabled) {
        setPosition((prevPosition) => {
          const newPosition = prevPosition - 1;
          return newPosition <= -totalWidth ? 0 : newPosition;
        });
      }
      animationFrame = requestAnimationFrame(autoScroll);
    };

    animationFrame = requestAnimationFrame(autoScroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [autoScrollEnabled, totalWidth]);

  const renderItems = () => {
    const repeatedItems = [...items, ...items, ...items]; // 아이템을 3번 반복
    return repeatedItems.map((item, index) => (
      <CarouselItem key={index}>
        <ProductCard product={item} />
      </CarouselItem>
    ));
  };

  return (
    <CarouselContainer>
      <ScrollButton onClick={() => handleScroll('left')}>←</ScrollButton>
      <CarouselTrack
        ref={trackRef}
        style={{ transform: `translateX(${position}px)` }}
      >
        {renderItems()}
      </CarouselTrack>
      <ScrollButton onClick={() => handleScroll('right')}>→</ScrollButton>
    </CarouselContainer>
  );
};

export default InfiniteCarousel;