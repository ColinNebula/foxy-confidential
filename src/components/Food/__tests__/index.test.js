import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Food from '..';
// Component being testedafterEach(cleanup);

describe('Food component', () => {
    it('renders', () => {
      render(<Food />);
    });
    
    it('matches snapshot DOM node structure', () => {
      const { asFragment } = render(<Food />);
      
      expect(asFragment()).toMatchSnapshot();
    });
  })