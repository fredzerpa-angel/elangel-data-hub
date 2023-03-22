// @mui material components
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import pxToRem from "assets/theme/functions/pxToRem";

export default styled(Paper)(({ theme, ownerState }) => {
  return {
    padding: pxToRem(24),
    borderRadius: '1rem',
    boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem',

    // FullCalendar CSS Override
    "&": {
      // Container
      ".fc-media-screen": {
        height: "100%",
        color: "rgb(52, 71, 103)",
      },

      // Header
      ".fc-toolbar-title": {
        textTransform: 'capitalize',
        fontSize: "1.125rem",
        fontWeight: "700",
      },

      ".fc-button, .fc-today-button, .fc-button:disabled": {
        transition: 'all 150ms ease-in 0s',
        backgroundColor: 'rgb(131, 146, 171)',
        borderColor: 'rgb(131, 146, 171)',
        fontSize: '0.875rem',
        boxShadow: 'rgba(0, 0, 0, 0.11) 0rem 0.25rem 0.4375rem -0.0625rem, rgba(0, 0, 0, 0.07) 0rem 0.125rem 0.25rem -0.0625rem',
        opacity: '1'
      },

      // Content
      ".fc .fc-view-harness-active > .fc-view": {
        position: 'static',
        height: '100%',
        width: '100%',
      },

      ".fc-theme-standard .fc-scrollgrid": {
        border: 'none',
      },

      ".fc-theme-standard thead tr th": {
        borderLeft: 'none',
        borderRight: 'none',
      },

      ".fc th": {
        textAlign: 'center'
      },

      ".fc-theme-standard td, .fc-theme-standard th": {
        borderColor: 'rgb(233, 236, 239)'
      },

      ".fc .fc-col-header-cell-cushion": {
        fontSize: '0.875rem',
        fontWeight: '500',
        color: 'rgb(173, 181, 189)',
        textTransform: 'capitalize',
      },

      ".fc-scrollgrid-section.fc-scrollgrid-section-body.fc-scrollgrid-section-liquid > td": {
        border: 'none',
      },

      ".fc .fc-scroller-liquid-absolute": {
        position: 'static'
      },

      ".fc-scrollgrid-sync-table": {
        height: 'auto'
      },

      ".fc .fc-daygrid-day-number": {
        color: 'rgb(73, 80, 87)',
        fontSize: '0.875rem',
        fontWeight: '500',
        width: '100%',
        textAlign: 'center'
      },

      ".fc-event-title": {
        padding: '0.1875rem 0.3rem 0.15625rem !important',
      },

      ".fc-h-event .fc-event-main .info": { backgroundImage: 'linear-gradient(310deg, rgb(33, 82, 255), rgb(33, 212, 253))' },
      ".fc-h-event .fc-event-main .error": { backgroundImage: 'linear-gradient(310deg, rgb(234, 6, 6), rgb(255, 102, 124))' },
      ".fc-h-event .fc-event-main .success": { backgroundImage: 'linear-gradient(310deg, rgb(23, 173, 55), rgb(152, 236, 45))' },
      ".fc-h-event .fc-event-main .warning": { backgroundImage: 'linear-gradient(310deg, rgb(245, 57, 57), rgb(251, 207, 51))' },

      ".fc-daygrid-event": {
        margin: '0.03125rem 0.125rem',
        border: 'none',
        borderRadius: '0.35rem',
        overflow: 'hidden', // Useful for Tooltip on Events
        fontSize: '0.875rem',
        fontWeight: '500'
      },
      ".fc .fc-daygrid-body-unbalanced .fc-daygrid-day-events": { minHeight: '2rem' },
    },
  }
})