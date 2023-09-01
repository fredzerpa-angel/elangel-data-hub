/**
 * https://github.com/fullcalendar/fullcalendar/blob/495d925436e533db2fd591e09a0c887adca77053/packages/common/src/common/StandardEvent.tsx#L79
 */

import React from "react";

// Reenderiza los cuadros de los eventos visualizados en el calendario
const FullcalendarEventBox = React.forwardRef(({ eventProps, ...rest }, ref) => {
	return (
		<div ref={ref} {...rest}>
			{
				eventProps.timeText && <div>{eventProps.timeText}</div>
			}
			<div>
				<div>
					{eventProps.event.title || <>&nbsp;</>}
				</div>
			</div>
		</div>
	);
})

export default FullcalendarEventBox;