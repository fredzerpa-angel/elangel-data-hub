

// @mui material components
import { Grid } from "@mui/material";

// @mui material icons
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";
import EventsOverview from "./components/EventsOverview";

import Calendar from "components/Calendar";

import EventGroupMembers from "./components/EventGroupMembers";
import AddEventButton from "./components/AddEventButton";
import useEvents from "hooks/events.hooks";
import { DateTime, Info } from "luxon";
import { useCallback, useMemo } from "react";
import { useAuth } from "context/auth.context";

const Events = () => {
  const { user } = useAuth();
  const { events, createEvent, updateEventById, deleteEventById } = useEvents();

  const handleUpdateEvent = async eventUpdated => await updateEventById(eventUpdated._id, eventUpdated);
  const handleDeleteEvent = async event => await deleteEventById(event._id);

  const EVENT_COLOR_MAP = useMemo(() => ({
    Pendiente: "info",
    Completado: "success",
    Cancelado: "error",
  }), []);

  const eventsWithColor = useMemo(() => (events.length && events.map(event => ({
    ...event,
    color: EVENT_COLOR_MAP[event.status],
  }))), [EVENT_COLOR_MAP, events]);


  const upComingEvents = useMemo(() => {
    return events.length && eventsWithColor.filter(event => DateTime.fromISO(event?.start).diffNow().as("days") >= 0)
  }, [events.length, eventsWithColor])

  const renderChart = useCallback(() => {
    const todayDT = DateTime.now();
    const MONTHS_LABELS = {
      short: Info.monthsFormat("short", { locale: "es" }),
      long: Info.monthsFormat("long", { locale: "es" }),
    }

    const chartLabels = todayDT.month > todayDT.minus({ months: 6 }).month ?
      MONTHS_LABELS.short.slice(todayDT.minus({ months: 6 }).month, todayDT.month)
      :
      MONTHS_LABELS.short.slice(todayDT.minus({ months: 6 }).month - 12).concat(MONTHS_LABELS.short.slice(0, todayDT.month))

    const chartData = {
      labels: chartLabels,
      datasets: [
        {
          label: "Mobile apps",
          color: "white",
          data: [50, 40, 300, 220, 500, 250],
        },
      ],
      // Clean chart
      options: {
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            }
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            }
          }
        }
      }
    }

    const participantsByMonth = events.reduce((monthsMap, event) => {
      const eventStartDT = DateTime.fromISO(event.start);
      const eventEndDT = DateTime.fromISO(event.end);

      const eventStartMonthLabel = MONTHS_LABELS.long[eventStartDT.month - 1];
      const eventStartPrevParticipants = monthsMap.get(eventStartMonthLabel);
      monthsMap.set(eventStartMonthLabel, eventStartPrevParticipants + event.participants.length)

      if (eventStartDT.startOf("month") < eventEndDT.startOf("month")) {
        const eventEndMonthLabel = MONTHS_LABELS.long[eventEndDT.month - 1];
        const eventEndMonthPrevParticipants = monthsMap.get(eventEndMonthLabel);
        monthsMap.set(eventEndMonthLabel, eventEndMonthPrevParticipants + event.participants.length)
      }

      return monthsMap;
    }, new Map(MONTHS_LABELS.long.map(month => [month, 0])))

    const prevMonth = {
      label: MONTHS_LABELS.long[todayDT.month - 2],
      getTotal: function () { return participantsByMonth.get(this.label) },
    };
    const thisMonth = {
      label: MONTHS_LABELS.long[todayDT.month - 1],
      getTotal: function () { return participantsByMonth.get(this.label) },
    };

    const porcentage = ((thisMonth.getTotal() * 100) / prevMonth.getTotal()) - 100;
    const isUp = porcentage > 0;
    return (
      <GradientLineChart
        title={
          <SoftTypography variant="h6" color="white">Participantes</SoftTypography>
        }
        description={(
          <SoftBox display="flex" alignItems="center">
            <SoftBox fontSize='large' color={isUp ? "success" : "error"} mr={0.5} lineHeight={0}>
              {isUp ? <ArrowUpward /> : <ArrowDownward />}
            </SoftBox>
            <SoftTypography variant="button" color="white" fontWeight="regular" textTransform="capitalize">
              <strong>{porcentage.toFixed(2)}% {isUp ? "Mas" : "Menos"}</strong> en {thisMonth.label}
            </SoftTypography>
          </SoftBox>
        )}
        p={0}
        sx={{
          background: 'linear-gradient(310deg, rgb(20, 23, 39), rgb(58, 65, 111))',
          '& > :first-of-type': {
            paddingTop: 2,
            paddingX: 2,
          }
        }}
        height="100%"
        chart={{ ...chartData, height: '5rem' }}
      />
    )

  }, [events])

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container width="100%" mb={3} spacing={3} px={2}>
          <Grid container item xs={12} sm={6} alignItems="flex-end">
            {user.privileges.events.upsert && <AddEventButton addEvent={createEvent} />}
          </Grid>
          <Grid container item xs={12} sm={6} justifyContent="flex-end">
            {user.privileges.users.upsert && <EventGroupMembers />}
          </Grid>
        </Grid>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={9}>
              <Calendar
                events={eventsWithColor}
                updateEvent={handleUpdateEvent}
                deleteEvent={handleDeleteEvent}
              />
            </Grid>

            <Grid item xs={12} lg={3}>

              <SoftBox mb={3}>
                <EventsOverview title="Proximos Eventos" events={upComingEvents} messageOnEmpty="No hay eventos proximos" />
              </SoftBox>

              <SoftBox mb={3}>
                {renderChart()}
              </SoftBox>

            </Grid>
          </Grid>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Events;
