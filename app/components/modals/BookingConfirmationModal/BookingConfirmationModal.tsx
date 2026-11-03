import { AnimatePresence } from "framer-motion";
import "./BookingConfirmationModal.css";
import { Button } from "../../button/Button";
import DialogFrame from "../../notifications/DialogFrame";

export default function BookingConfirmationModal({
  isOpen,
  onClose,
  apartment,
  onConfirm,
}) {
  const totalPriceWithServiceFee = apartment.price;
  const serviceFee = totalPriceWithServiceFee * 0.1;
  const rent = totalPriceWithServiceFee - serviceFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <DialogFrame
          id="booking-confirmation"
          labelledBy="booking-confirmation-title"
          closeOnBackdrop
          onClose={onClose}
          panelClassName="booking-modal">
          <div className="modal-header">
            <h2 id="booking-confirmation-title">Confirm Booking</h2>
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

            {/* <div className="modal-section fees">
              <div>
                <label>Rent:</label>
                <p>₦{rent.toLocaleString()}</p>
              </div>

              <div>
                <label>Service Fee:</label>
                <p>₦{serviceFee.toLocaleString()}</p>
              </div>
            </div> */}

            <div className="modal-section total">
              <label>Total Payment:</label>
              <p>₦{totalPriceWithServiceFee.toLocaleString()}</p>
            </div>

            <span className="modal-disclaimer">
              Full apartment address and agent contact will only be shared
              after payment is confirmed. This helps protect agent privacy and
              ensure safe bookings through Kampus Abode.
            </span>
          </div>

          <div className="modal-footer">
            <Button
              variant="secondary"
              size="md"
              title="cancel"
              onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              title="confirm"
              onClick={onConfirm}>
              Proceed
            </Button>
          </div>
        </DialogFrame>
      )}
    </AnimatePresence>
  );
}
