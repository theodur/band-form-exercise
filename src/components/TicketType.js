import React from 'react';

import { centsToDollars } from '../utils/formatters';

/**
 * Renders a ticket type card with the name, description, cost, and quantity input.
 *
 * @param {Object} props
 * @param {Object} props.ticketType - Ticket data including name, description, cost, and type identifier.
 * @param {Function} props.register - React Hook Form's register function for form input registration.
 * @returns {JSX.Element} Ticket type form input UI.
 */
function TicketType({ticketType, register}) {
  const formattedPrice = centsToDollars(ticketType.cost);

  return (
    <>
      <div className="ticket-type-card">
        <div>
          <div className="ticket-name">{ticketType.name.toUpperCase()}</div>
          <p className="description-text">{ticketType.description}</p>
        </div>
        <input
          type="number"
          min={0}
          defaultValue={0}
          className="ticket-quantity-input"
          aria-label={`Quantity for ${ticketType.name}`}
          {...register(`tickets.${ticketType.type}`, {
            valueAsNumber: true,
            min: 0,
            defaultValue: 0,
          })}
        />
      </div>
      <div className="ticket-price">${formattedPrice}</div>
    </>
  );
}

export default TicketType;
