import { Add } from "@mui/icons-material";
import SoftButton from "components/SoftButton";


const AddEventButton = () => {

  return (
    <SoftButton
      variant="gradient"
      color="info"
      startIcon={<Add />}
      sx={{
        "&:hover": {
          transform: 'none'
        }
      }}
    >
      Evento
    </SoftButton>

  )
}

export default AddEventButton;