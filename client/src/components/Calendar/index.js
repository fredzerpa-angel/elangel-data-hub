import { forwardRef, useMemo, useState } from 'react';

import { Tooltip } from '@mui/material';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import esLocale from '@fullcalendar/core/locales/es-us';
import { DateTime } from 'luxon';

import CalendarRoot from './CalendarRoot';
import FullcalendarEventBox from './components/FullcalendarEventBox';
import EventsModal from 'components/Modals/EventsModal/EventsModal';

const Calendar = forwardRef(({ events = [], fullCalendarProps, updateEvent, deleteEvent }, ref) => {
  const [viewEventInfo, setViewEventInfo] = useState(null);

  const viewEvent = ({ event: clickedEvent }) => setViewEventInfo(events.find(event => event._id === clickedEvent.id));
  const closeEventModal = () => setViewEventInfo(null);

  const eventsFormatted = useMemo(() => (events.length && events.map(event => {
    return {
      ...event,
      id: event._id,
      end: DateTime.fromISO(event?.end || event.start).plus({ days: 1 }).toISODate(),
    }
  })), [events]);

  const addTooltipToEvent = (eventProps) => {
    const eventTitle = eventProps.event.title;
    const eventColor = eventProps.event.backgroundColor;
    return (
      <Tooltip title={eventTitle} placement="top" arrow>
        <FullcalendarEventBox eventProps={eventProps} className={eventColor} />
      </Tooltip>
    )
  }

  return (
    <>
      <CalendarRoot ref={ref}>
        <FullCalendar
          plugins={[dayGridPlugin]}
          locale={esLocale}
          dayMaxEvents={true} // true is specified, the number of events will be limited to the height of the day cell.
          height={500}
          events={eventsFormatted}
          eventContent={addTooltipToEvent}
          eventClick={viewEvent}
          {...fullCalendarProps}
        />
      </CalendarRoot>
      {
        viewEventInfo &&
        (
          <EventsModal
            open={Boolean(viewEventInfo)}
            close={closeEventModal}
            event={viewEventInfo}
            upsertEvent={updateEvent}
            deleteEvent={deleteEvent}
          />
        )
      }
    </>
  )
})

export default Calendar