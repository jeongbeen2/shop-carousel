// src/InfiniteCarousel.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import ProductCard from './ProductCard';

const MOBILE_BREAKPOINT = 768;
const AUTO_SCROLL_INTERVAL = 3000; // 3초

const scroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-100% / 2));
  }
`;

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
  width: 200%; // Double the width to allow for seamless looping
  animation: ${scroll} 60s linear infinite;
  animation-play-state: ${props => props.isPaused ? 'paused' : 'running'};
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    width: 100%;
    animation: none;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const CarouselItem = styled.div`
  flex: 0 0 calc(100% / 12); // Show 6 items on largest screen
  max-width: 300px;
  padding: 10px;
  box-sizing: border-box;

  @media (max-width: 1600px) {
    flex: 0 0 calc(100% / 10); // Show 5 items
  }

  @media (max-width: 1280px) {
    flex: 0 0 calc(100% / 8); // Show 4 items
  }

  @media (max-width: 1024px) {
    flex: 0 0 calc(100% / 6); // Show 3 items
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
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const resetAutoScroll = useCallback(() => {
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), AUTO_SCROLL_INTERVAL);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
    resetAutoScroll();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScroll = (direction) => {
    const scrollAmount = trackRef.current.offsetWidth / 2;
    trackRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    resetAutoScroll();
  };

  useEffect(() => {
    const track = trackRef.current;
    if (track) {
      const resetAnimationOnIteration = () => {
        track.style.animation = 'none';
        track.offsetHeight; // Trigger reflow
        track.style.animation = null;
      };

      track.addEventListener('mousedown', handleMouseDown);
      track.addEventListener('mouseup', handleMouseUp);
      track.addEventListener('mousemove', handleMouseMove);
      track.addEventListener('mouseleave', handleMouseUp);
      track.addEventListener('animationiteration', resetAnimationOnIteration);

      return () => {
        track.removeEventListener('mousedown', handleMouseDown);
        track.removeEventListener('mouseup', handleMouseUp);
        track.removeEventListener('mousemove', handleMouseMove);
        track.removeEventListener('mouseleave', handleMouseUp);
        track.removeEventListener('animationiteration', resetAnimationOnIteration);
      };
    }
  }, [isDragging, startX, scrollLeft, handleMouseDown, handleMouseUp, handleMouseMove]);

  return (
    <CarouselContainer>
      <ScrollButton onClick={() => handleScroll('left')}>←</ScrollButton>
      <CarouselTrack ref={trackRef} isPaused={isPaused}>
        {items.concat(items).map((item, index) => (
          <CarouselItem key={index}>
            <ProductCard product={item} />
          </CarouselItem>
        ))}
      </CarouselTrack>
      <ScrollButton onClick={() => handleScroll('right')}>→</ScrollButton>
    </CarouselContainer>
  );
};

export default InfiniteCarousel;