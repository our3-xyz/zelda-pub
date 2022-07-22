import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import QRGenerator from './QRGenerator';
import { MemoryRouter } from 'react-router-dom';

test('test qr code component', () => {
  render(<QRGenerator />, {wrapper: MemoryRouter});
  const linkElement = screen.getByText(/no data/i);
  expect(linkElement).toBeInTheDocument();
});
