import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('works', () => {
  const { getByText } = render(<App />);
  const text = getByText(/my time machine works/i);
  expect(text).toBeInTheDocument();
});
