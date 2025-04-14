import React from 'react';
import { render, screen } from '@testing-library/react';

import TicketType from './TicketType';
import { centsToDollars } from '../utils/formatters';

jest.mock('../utils/formatters', () => ({
  centsToDollars: jest.fn(),
}));

describe('TicketType Component', () => {
  const mockRegister = jest.fn();
  const ticketType = {
    name: 'vip',
    description: 'Access to VIP lounge and priority seating.',
    cost: 5000,
    type: 'vip',
  };

  beforeEach(() => {
    centsToDollars.mockReturnValue('50.00');
  });

  it('renders the ticket name in uppercase', () => {
    render(<TicketType ticketType={ticketType} register={mockRegister} />);
    expect(screen.getByText('VIP')).toBeInTheDocument();
  });

  it('renders the ticket description', () => {
    render(<TicketType ticketType={ticketType} register={mockRegister} />);
    expect(screen.getByText('Access to VIP lounge and priority seating.')).toBeInTheDocument();
  });

  it('renders the formatted price', () => {
    render(<TicketType ticketType={ticketType} register={mockRegister} />);
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });

  it('renders an input field with correct attributes', () => {
    render(<TicketType ticketType={ticketType} register={mockRegister} />);

    const input = screen.getByLabelText('Quantity for vip');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveValue(0);
  });

  it('calls the register function with correct arguments', () => {
    render(<TicketType ticketType={ticketType} register={mockRegister} />);

    expect(mockRegister).toHaveBeenCalledWith('tickets.vip', {
      valueAsNumber: true,
      min: 0,
      defaultValue: 0,
    });
  });
});
