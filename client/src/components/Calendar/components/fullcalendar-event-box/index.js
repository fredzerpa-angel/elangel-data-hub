/**
 * https://github.com/fullcalendar/fullcalendar/blob/495d925436e533db2fd591e09a0c887adca77053/packages/common/src/common/StandardEvent.tsx#L79
 */

import React from "react";

// Render the same event container as FullCalendar
const FullcalendarEventBox = React.forwardRef(({ eventProps, ...rest }, ref) => {
	return (
		<div className='fc-event-main-frame' ref={ref} {...rest}>
			{eventProps.timeText &&
				<div className='fc-event-time'>{eventProps.timeText}</div>
			}
			<div className='fc-event-title-container'>
				<div className='fc-event-title fc-sticky'>
					{eventProps.event.title || <>&nbsp;</>}
				</div>
			</div>
		</div>
	);
})

export default FullcalendarEventBox;