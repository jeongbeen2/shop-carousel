import React from 'react'
import { Global, css } from '@emotion/react'

const GlobalStyles = () => (
  <Global
    styles={css`
      body {
        margin: 0;
        padding: 0;
        font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    `}
  />
)

export default GlobalStyles