import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BandForm from './BandForm';
import { centsToDollars } from './utils/formatters';

const mockBand = {
  name: 'Nirvana',
  id: "nirvana",
  date: 1686761430000,
  location: 'Seattle, WA',
  description_blurb: '<p>A legendary rock band from Aberdeen, Washington.</p>',
  imgUrl: "https://via.placeholder.com/600/54176f",
  ticketTypes: [
    {
      type: "general",
      name: "General Admission",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      cost: 6000
    },
    {
      type: "vip",
      name: "VIP",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      cost: 15000
    }
  ],
};

describe('BandForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  it('renders band information correctly', () => {
    render(<BandForm band={mockBand} />);

    expect(screen.getByText(mockBand.name)).toBeInTheDocument();
    expect(screen.getByText('Wednesday, June 14')).toBeInTheDocument();
    expect(screen.getByText(mockBand.location)).toBeInTheDocument();
    expect(screen.getByText('A legendary rock band from Aberdeen, Washington.')).toBeInTheDocument();
  });

  it('renders ticket types correctly', () => {
    render(<BandForm band={mockBand} />);

    mockBand.ticketTypes.forEach((ticket) => {
      expect(screen.getByText(ticket.name.toUpperCase())).toBeInTheDocument();
      expect(screen.getByText(ticket.description)).toBeInTheDocument();
      expect(screen.getByText(`$${centsToDollars(ticket.cost)}`)).toBeInTheDocument();
    });
  });

  it('validates required fields on form submission', async () => {
    render(<BandForm band={mockBand} />);
    const submitButton = screen.getByText('Get Tickets');

    await userEvent.click(submitButton);

    expect(await screen.findByText('First name is required')).toBeInTheDocument();
    expect(await screen.findByText('Last name is required')).toBeInTheDocument();
    expect(await screen.findByText('Address is required')).toBeInTheDocument();
    expect(await screen.findByText('Card number is required')).toBeInTheDocument();
    expect(await screen.findByText('Expiration date is required')).toBeInTheDocument();
    expect(await screen.findByText('CVV is required')).toBeInTheDocument();
  });

  it('calculates total cost correctly based on ticket quantities', async () => {
    render(<BandForm band={mockBand} />);

    const generalInput = screen.getByLabelText('Quantity for General Admission');
    const vipInput = screen.getByLabelText('Quantity for VIP');

    await userEvent.clear(generalInput);
    await userEvent.clear(vipInput);
    await userEvent.type(generalInput, '2');
    await userEvent.type(vipInput, '1');

    expect(await screen.findByText('$270')).toBeInTheDocument();
  });

  it('prevents user form submitting form without selecting ticket', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();

    render(<BandForm band={mockBand} />);
    const submitButton = screen.getByText('Get Tickets');

    await userEvent.type(screen.getByPlaceholderText('First Name'), 'John');
    await userEvent.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await userEvent.type(screen.getByPlaceholderText('Address'), '123 Main St');
    await userEvent.type(screen.getByPlaceholderText('0000 0000 0000 0000'), '4111 1111 1111 1111');
    await userEvent.type(screen.getByPlaceholderText('MM/YY'), '12/25');
    await userEvent.type(screen.getByPlaceholderText('CVV'), '123');   
    await userEvent.click(submitButton);

    expect(alertMock).toHaveBeenCalledWith("Please select at least one ticket type.");
  });

  it('submits form data correctly', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();

    const expectedData = {
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      cardNumber: "4111 1111 1111 1111",
      expiryDate: "12/25",
      cvv: "123",
      tickets: {
        general: 2,
        vip: 1,
      },
      totalCost: 27000,
    };    

    render(<BandForm band={mockBand} />);

    const submitButton = screen.getByText('Get Tickets');
    const generalInput = screen.getByLabelText('Quantity for General Admission');
    const vipInput = screen.getByLabelText('Quantity for VIP');

    await userEvent.clear(generalInput);
    await userEvent.clear(vipInput);
    await userEvent.type(generalInput, '2');
    await userEvent.type(vipInput, '1')

    await userEvent.type(screen.getByPlaceholderText('First Name'), expectedData.firstName);
    await userEvent.type(screen.getByPlaceholderText('Last Name'), expectedData.lastName);
    await userEvent.type(screen.getByPlaceholderText('Address'), expectedData.address);
    await userEvent.type(screen.getByPlaceholderText('0000 0000 0000 0000'), expectedData.cardNumber);
    await userEvent.type(screen.getByPlaceholderText('MM/YY'), expectedData.expiryDate);
    await userEvent.type(screen.getByPlaceholderText('CVV'), expectedData.cvv);   
    await userEvent.click(submitButton);

    expect(alertMock).toHaveBeenCalledWith(JSON.stringify(expectedData, null, 2));
    alertMock.mockRestore();
  });
});
