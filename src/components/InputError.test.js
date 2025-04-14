import React from 'react';
import { render, screen } from '@testing-library/react';

import InputError from './InputError';

describe('InputError Component', () => {
  it('renders the error message when message is provided', () => {
    render(<InputError message="Example error" id="exampleError" />);

    const errorMessage = screen.getByRole('alert');

    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Example error');
    expect(errorMessage).toHaveAttribute('id', 'exampleError');
  });

  it('does not render anything when message is not provided', () => {
    render(<InputError message="" id="error-id" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('applies the correct aria-live and role attributes', () => {
    render(<InputError message="Another error" id="error-id" />);

    const errorMessage = screen.getByRole('alert');

    expect(errorMessage).toHaveAttribute('aria-live', 'assertive');
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });
});
