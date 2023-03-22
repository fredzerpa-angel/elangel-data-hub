

// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DefaultItem from "examples/Items/DefaultItem";


const EventsOverview = ({ events }) => {

  const renderEventsItems = (events) => {

    return events.map(event => {
      const eventIconMapByColor = {
        'info': 'info_outlined',
        'error': 'error_outlined',
        'warning': 'warning_amber',
        'success': 'done_outlined',
      }
      return (
        <DefaultItem
          key={event.title + event.start}
          color={event.color}
          icon={eventIconMapByColor[event.color]}
          title={event.title}
          description={event.start}
        />
      )
    })
  }


  return (
    <Card>
      <SoftBox pt={3} px={3}>
        <SoftTypography variant="h6" fontWeight="medium">
          Proximos Eventos
        </SoftTypography>
      </SoftBox>
      <SoftBox p={2}>
        {renderEventsItems(events)}
      </SoftBox>
    </Card>
  );
}

export default EventsOverview;
