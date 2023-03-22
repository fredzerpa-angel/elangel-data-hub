
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import esLocale from '@fullcalendar/core/locales/es-us';
import CalendarRoot from './CalendarRoot';
import { forwardRef } from 'react';
import { Tooltip } from '@mui/material';
import FullcalendarEventBox from './components/fullcalendar-event-box';


const Calendar = forwardRef(({ events, ...fullCalendarProps }, ref) => {

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
    <CalendarRoot ref={ref}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        locale={esLocale}
        dayMaxEvents={true} // true is specified, the number of events will be limited to the height of the day cell.
        height={500}
        events={events}
        eventContent={addTooltipToEvent}
        {...fullCalendarProps}
      />
    </CalendarRoot>
  )
})

export default Calendar