import { Add } from "@mui/icons-material";
import EventsModal from "components/Modals/EventsModal/EventsModal";
import SoftButton from "components/SoftButton";
import { useState } from "react";


const AddEventButton = ({ addEvent }) => {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <>
      <SoftButton
        variant="gradient"
        color="info"
        startIcon={<Add />}
        sx={{
          "&:hover": {
            transform: 'none'
          }
        }}
        onClick={openModal}
      >
        Eventos
      </SoftButton>
      {open && <EventsModal open={open} close={closeModal} upsertEvent={addEvent} />}
    </>
  )
}

export default AddEventButton;