import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faCalendar, faCreditCard } from '@fortawesome/free-regular-svg-icons';

import TicketType from './components/TicketType';
import InputError from './components/InputError';
import { centsToDollars } from './utils/formatters';

function BandForm({ band }) {
  // State for handling loading band image. Used to show a placeholder while the image is loading.
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Initialize React Hook Form with default values and access form utilities.
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      address: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      tickets: {},
      totalCost: 0,
    },
  });

  // Sanitize band description blurb to prevent XSS attacks.
  const sanitizedDescriptionBlurb = DOMPurify.sanitize(band.description_blurb);

  // Keep track of quantity changes to tickets, so we can calculate the total cents.
  const ticketQuantities = watch("tickets");

  const totalCents = band.ticketTypes.reduce((cents, ticket) => {
    const quantity = ticketQuantities?.[ticket.type] || 0;
    return cents + quantity * ticket.cost;
  }, 0);

  // Keep the total cost in the form state updated so it can be returned to the API.
  useEffect(() => {
    setValue('totalCost', totalCents);
  }, [totalCents, setValue]);
  
  const formattedTotal = centsToDollars(totalCents);
  const formattedDate = new Date(band.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Log and display the form data that would be sent to the API
  const onSubmit = (data) => {
    const hasValidTickets = data.tickets && Object.values(data.tickets).some(qty => qty > 0);

    if (!hasValidTickets) {
      alert("Please select at least one ticket type.");
      return;
    }

    const formattedData = JSON.stringify(data, null, 2);
    console.log(formattedData);
    alert(formattedData);
  };

  return (
    <div className="band-form-page">
      <div className="description-group">
        <h1>{band.name}</h1>
        <div className="description-text">
          <FontAwesomeIcon icon={faCalendar} /> {formattedDate}
        </div>
        <div className="description-text">
          <FontAwesomeIcon icon={faLocationDot} /> {band.location}
        </div>
      </div>

      <div className="band-form-content">
        <div className="band-info">
          {!isImageLoaded && <div role="status" className="image-placeholder">Loading...</div>}
          <img 
            src="https://picsum.photos/450" 
            alt={band.name} 
            onLoad={() => setIsImageLoaded(true)} 
            className={`rounded-box ${!isImageLoaded ? 'hidden' : ''}`} 
          />
          <div className="description-text" dangerouslySetInnerHTML={{ __html: sanitizedDescriptionBlurb }}></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="form rounded-box">
          <h2>Select Tickets</h2>
          {band.ticketTypes.map((ticket) => (
            <div key={ticket.type}>
              <TicketType ticketType={ticket} register={register} />
              <hr />
            </div>
          ))}

          <div className="total">
            <div className="total-title">TOTAL</div>
            ${formattedTotal}
          </div>

          <div className="horizontal-inputs">
            <div>
              <input 
                type="text" 
                placeholder="First Name" 
                aria-label="First Name"
                aria-describedby={errors.firstName ? "firstNameError" : undefined}
                className={errors.firstName ? 'input-error' : ''}
                {...register('firstName', { required: "First name is required" })} 
              />
              <InputError message={errors.firstName?.message} id="firstNameError" />
            </div>
            <div>
              <input 
                type="text" 
                placeholder="Last Name" 
                aria-label="Last Name"
                aria-describedby={errors.lastName ? "lastNameError" : undefined}
                className={errors.lastName ? 'input-error' : ''}
                {...register('lastName', { required: "Last name is required" })} 
              />
              <InputError message={errors.lastName?.message} id="lastNameError" />
            </div>
          </div>

          <input 
            type="text" 
            placeholder="Address" 
            aria-label="Address"
            aria-describedby={errors.address ? "addressError" : undefined}
            className={errors.address ? 'input-error' : ''}
            {...register('address', { required: "Address is required" })} 
          />
          <InputError message={errors.address?.message} id="addressError" />

          <h3>Payment Details</h3>
          <div>
            <div className="input-with-icon">
              <input 
                type="text" 
                inputMode="numeric"
                placeholder="0000 0000 0000 0000" 
                aria-label="Card Number"
                aria-describedby={errors.cardNumber ? "cardNumberError" : undefined}
                className={errors.cardNumber ? 'input-error' : ''}
                {...register('cardNumber', {
                  required: "Card number is required",
                  pattern: {
                    value: /^[\d\s]{13,19}$/, // Validates card numbers with 13-19 digits, allowing spaces between digits
                    message: "Enter a valid card number",
                  },
                })}                 
              />
              <FontAwesomeIcon icon={faCreditCard} className="icon-inside-input" />
            </div>
            <InputError message={errors.cardNumber?.message} id="cardNumberError" />
          </div>

          <div className="horizontal-inputs">
            <div>
              <input 
                type="text" 
                placeholder="MM/YY"
                aria-label="Expiration Date"
                aria-describedby={errors.expiryDate ? "expiryDateError" : undefined}
                className={errors.expiryDate ? 'input-error' : ''}
                {...register('expiryDate', { 
                  required: "Expiration date is required",
                  pattern: {
                    value: /^(0[1-9]|1[0-2])\/\d{2}$/, // Validates MM/YY format
                    message: "Enter a valid expiration date (MM/YY)",
                  },
                })}
              />
              <InputError message={errors.expiryDate?.message} id="expiryDateError" />
            </div>
            <div>
              <input 
                type="text"
                inputMode="numeric"
                placeholder="CVV"
                aria-label="CVV"
                aria-describedby={errors.cvv ? "cvvError" : undefined}
                className={errors.cvv ? 'input-error' : ''}
                {...register('cvv', { 
                  required: "CVV is required",
                  pattern: {
                    value: /^\d{3,4}$/, // Validates CVV with 3 or 4 digits
                    message: "Enter a valid CVV",
                  },
                })} 
              />
              <InputError message={errors.cvv?.message} id="cvvError" />
            </div>
          </div>

          <button type="submit" className="purchase-button rounded-box">Get Tickets</button>
        </form>
      </div>
    </div>
  );
}

export default BandForm;
