

// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DefaultItem from "components/Items/DefaultItem";
import { DateTime } from "luxon";
import SimpleBar from "simplebar-react";


const EventsOverview = ({ title = "", events = [], messageOnEmpty = "N/A" }) => {

  const renderEventsItems = (events) => {
    const sortedEvents = events.sort((a, b) => DateTime.fromISO(a.start).diff(DateTime.fromISO(b.start)).as("milliseconds"));

    return sortedEvents.map(event => {
      const eventIconMapByColor = {
        "info": "info_outlined",
        "error": "error_outlined",
        "warning": "warning_amber",
        "success": "done_outlined",
      }
      return (
        <DefaultItem
          key={event.title + event.start}
          color={event.color}
          icon={eventIconMapByColor[event.color]}
          title={event.title}
          description={DateTime.fromISO(event.start).setLocale("es").toLocaleString()}
        />
      )
    })
  }


  return (
    <Card>
      <SoftBox pt={3} px={3}>
        <SoftTypography variant="h6" fontWeight="medium">
          {title}
        </SoftTypography>
      </SoftBox>
      <SimpleBar style={{ maxHeight: '20rem' }}>
        <SoftBox p={2}>
          {
            events.length ?
              renderEventsItems(events)
              :
              <SoftTypography textAlign="center" variant="body2" fontWeight="regular" textTransform="uppercase">
                {messageOnEmpty}
              </SoftTypography>
          }
        </SoftBox>
      </SimpleBar>
    </Card>
  );
}

export default EventsOverview;
