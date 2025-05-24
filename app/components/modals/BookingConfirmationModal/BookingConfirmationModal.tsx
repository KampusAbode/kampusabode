import "./BookingConfirmationModal.css";

export default function BookingConfirmationModal({
  isOpen,
  onClose,
  apartment,
  onConfirm,
}) {
  if (!isOpen) return null;

  const totalPriceWithServiceFee = apartment.price;
  const serviceFee = totalPriceWithServiceFee * 0.1;
  const rent = totalPriceWithServiceFee - serviceFee;

  return (
    <div className="modal-overlay">
      <div className="booking-modal">
        <div className="modal-header">
          <h2>Confirm Your Booking</h2>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <label>Apartment:</label>
            <p>{apartment.title}</p>
          </div>

          <div className="modal-section">
            <label>Area:</label>
            <p>{apartment.area}</p>
          </div>

          <div className="modal-section">
            <label>Rent:</label>
            <p>₦{rent.toLocaleString()}</p>

            <label>Service Fee:</label>
            <p>₦{serviceFee.toLocaleString()}</p>
          </div>

          <div className="modal-section total">
            <label>Total Payment:</label>
            <p>
              <strong>₦{totalPriceWithServiceFee.toLocaleString()}</strong>
            </p>
          </div>

          <span className="modal-disclaimer">
            Full apartment address and agent contact will only be shared after
            payment is confirmed. This helps protect agent privacy and ensure
            safe bookings through Kampus Abode.
          </span>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            title="Button"
            onClick={onClose}>
            Cancel
          </button>
          <button className="btn" title="Button" onClick={onConfirm}>
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
