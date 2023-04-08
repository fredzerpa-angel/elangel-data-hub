import { memo, useState } from "react";

// Soft UI components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftTypography from "components/SoftTypography";

// Libraries
import { Card, Grid, MenuItem, Modal, Select } from "@mui/material";
import SimpleBar from "simplebar-react";
import { Controller, useForm } from "react-hook-form";
import { defaultsDeep } from "lodash";
import { enqueueSnackbar } from "notistack";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from "luxon";
import AutocompleteCheckbox from "./AutocompleteCheckbox";
import useEmployees from "hooks/employees.hooks";
import useStudents from "hooks/students.hooks";
import { useAuth } from "context/auth.context";
import isEqual from "react-fast-compare";
import { Lock } from "@mui/icons-material";
import GetPasswordConsent from "components/GetPasswordConsent";

const DEFAULT_VALUES = {
  type: "",
  title: "",
  organization: "",
  overseers: [],
  goal: "",
  participants: [],
  start: DateTime.now(),
  end: DateTime.now(),
  observations: "",
  status: "Pendiente",
}

const formatEventData = (event = {}) => ({
  ...event,
  start: DateTime.fromISO(event?.start),
  end: DateTime.fromISO(event?.end)
})

const EventsModal = ({ open, close, event = {}, upsertEvent, deleteEvent }) => {
  const { user } = useAuth();
  const { employees, isLoading: fetchingEmployees } = useEmployees();
  const { students, isLoading: fetchingStudents } = useStudents();
  const { register, control, handleSubmit, getValues, formState: { errors } } = useForm({
    defaultValues: defaultsDeep(formatEventData(event), DEFAULT_VALUES),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteEvent = async () => {
    try {
      const consent = await GetPasswordConsent({
        title: "Eliminar Evento",
        description: `Ingrese su clave para eliminar: ${getValues("title")}`,
      });
      if (consent?.error || !consent) throw new Error(consent?.message || "Contraseña incorrecta");

      setIsSubmitting(true);
      const response = await deleteEvent(event);
      if (response?.error || !response) throw new Error(response?.message || `No se pudo eliminar el evento`);
      enqueueSnackbar(`Se ha eliminado el evento con exito`, { variant: "success" });
      close();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  const onSubmit = async eventData => {
    try {
      setIsSubmitting(true);
      const isUpdatingEvent = Object.keys(event).length;
      eventData.start = eventData.start.toJSDate();
      eventData.end = eventData?.end.toJSDate();

      if (isUpdatingEvent) {
        eventData.updates.push({ issuedBy: user, issuedAt: DateTime.now().toJSDate() })
      } else {
        eventData.createdAt = DateTime.now().toJSDate();
        eventData.createdBy = user;
      }

      eventData.overseers = eventData.overseers.map(overseer => typeof overseer === "string" ? overseer : overseer._id)
      eventData.participants = eventData.participants.map(participant => typeof participant === "string" ? participant : participant._id)

      const response = await upsertEvent(eventData);
      if (response?.error || !response) throw new Error(response?.message || `No se pudo ${isUpdatingEvent ? "actualizar" : "crear"} el evento`);
      enqueueSnackbar(`Se ha ${isUpdatingEvent ? "actualizado" : "creado"} el evento con exito`, { variant: "success" });
      close();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="create-user"
    >
      <Card
        component='form'
        encType="multipart/form-data"
        onSubmit={handleSubmit(onSubmit)}
        sx={theme => ({
          width: '550px',
          maxWidth: '100%',
          position: 'absolute',
          overflow: "hidden",
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          [theme.breakpoints.down("md")]: {
            height: "100%",
            width: "100%",
            borderRadius: 0,
          },
        })}
      >
        <SimpleBar
          style={{
            maxHeight: window.matchMedia("(max-width:767.95px)").matches ? "100vh" : "90vh",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="es-es">
            <SoftBox p={3}>
              <SoftTypography variant="h4" fontWeight="medium" textTransform="capitalize" gutterBottom>
                {event?.title || "Nuevo Evento"}
              </SoftTypography>

              <SoftBox>
                <Grid container spacing={2} mb={1}>
                  <Grid item container xs={6}>
                    <Grid ml={0.5}>
                      <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                        Fecha de Inicio*
                      </SoftTypography>
                    </Grid>
                    <Controller
                      name="start"
                      control={control}
                      render={({ field: { value, onChange, ...rest } }) => (
                        <DatePicker
                          {...rest}
                          value={value}
                          onChange={newValue => {
                            return onChange(newValue);
                          }}
                          sx={{ width: "100%" }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              sx: {
                                "& > :first-of-type": {
                                  borderColor: errors?.start && "#fd5c70",
                                  "& > input": {
                                    width: "100%!important"
                                  }
                                }
                              }
                            },
                          }}
                          readOnly={!user.privileges.events.upsert}
                        />
                      )}
                      rules={{
                        required: "Este campo es obligatorio",
                        validate: {
                          isLuxonValid: value => !value.invalid || "Fecha Invalida",
                          isBeforeEnd: value => value.diff(getValues("end")).as("days") <= 0 || "No puede ser mayor que su culminacion"
                        }
                      }}
                    />
                    {!!errors?.start && <SoftTypography ml={0.5} fontSize="small" color="error" fontWeight="light">{errors?.start.message}</SoftTypography>}
                  </Grid>
                  <Grid item xs={6}>
                    <SoftBox ml={0.5}>
                      <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                        Fecha de Culminacion
                      </SoftTypography>
                    </SoftBox>
                    <Controller
                      name="end"
                      control={control}
                      render={({ field: { value, onChange, ...rest } }) => (
                        <DatePicker
                          {...rest}
                          value={value}
                          onChange={onChange}
                          sx={{ width: "100%" }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              sx: {
                                "& > :first-of-type": {
                                  borderColor: errors?.end && "#fd5c70",
                                  "& > input": {
                                    width: "100%!important"
                                  }
                                }
                              }
                            },
                          }}
                          readOnly={!user.privileges.events.upsert}
                        />
                      )}
                      rules={{
                        validate: {
                          isAfterStart: value => value.diff(getValues("start")).as("days") >= 0 || "No puede ser menor que el inicio",
                        }
                      }}
                    />
                    {!!errors?.end && <SoftTypography ml={0.5} fontSize="small" color="error" fontWeight="light">{errors?.end.message}</SoftTypography>}
                  </Grid>
                </Grid>

                <SoftBox display="flex" justifyContent="space-between" gap={2} width="100%" mb={1}>
                  <SoftBox width="100%">
                    <SoftBox ml={0.5}>
                      <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                        Organizacion*
                      </SoftTypography>
                    </SoftBox>
                    <SoftInput
                      {...register("organization", { required: "Este campo es obligatorio" })}
                      error={!!errors?.organization}
                      placeholder="Organizacion"
                      readOnly={!user.privileges.events.upsert}
                    />
                    {!!errors?.organization && <SoftTypography ml={0.5} fontSize="small" color="error" fontWeight="light">{errors?.organization.message}</SoftTypography>}
                  </SoftBox>
                  <SoftBox width="100%" sx={{ '#status-select': { width: "100%!important" } }}>
                    <SoftBox ml={0.5}>
                      <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                        Estatus*
                      </SoftTypography>
                    </SoftBox>
                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Select
                          {...field}
                          error={!!errors?.status}
                          fullWidth
                          id="status-select"
                          SelectDisplayProps={{
                            width: "100%!important",
                          }}
                          readOnly={!user.privileges.events.upsert}
                        >
                          <MenuItem value="Pendiente" sx={{ my: 0.5 }} >Pendiente</MenuItem>
                          <MenuItem value="Completado" sx={{ my: 0.5 }} >Completado</MenuItem>
                          <MenuItem value="Cancelado" sx={{ my: 0.5 }} >Cancelado</MenuItem>
                        </Select>
                      )}
                    />
                    {!!errors?.status && <SoftTypography ml={0.5} fontSize="small" color="error" fontWeight="light">{errors?.status.message}</SoftTypography>}
                  </SoftBox>
                </SoftBox>

                <SoftBox mb={1}>
                  <SoftBox ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Tipo de Evento*
                    </SoftTypography>
                  </SoftBox>
                  <SoftInput
                    {...register("type", { required: "Este campo es obligatorio" })}
                    error={!!errors?.type}
                    placeholder="Ej: Festival Musical"
                    readOnly={!user.privileges.events.upsert}
                  />
                  {!!errors?.type && <SoftTypography ml={0.5} fontSize="small" color="error" fontWeight="light">{errors?.type.message}</SoftTypography>}
                </SoftBox>

                <SoftBox mb={1}>
                  <SoftBox ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Nombre del Evento*
                    </SoftTypography>
                  </SoftBox>
                  <SoftInput
                    {...register("title", { required: "Este campo es obligatorio" })}
                    error={!!errors?.title}
                    placeholder="Ej: Musica Tradicional"
                    readOnly={!user.privileges.events.upsert}
                  />
                  {!!errors?.title && <SoftTypography ml={0.5} fontSize="small" color="error" fontWeight="light">{errors?.title.message}</SoftTypography>}
                </SoftBox>

                <SoftBox mb={1}>
                  <SoftBox ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Responsables
                    </SoftTypography>
                  </SoftBox>
                  <Controller
                    control={control}
                    name="overseers"
                    render={
                      ({ field: { ref, value, onChange, ...rest } }) => (
                        <AutocompleteCheckbox
                          {...rest}
                          readOnly={!user.privileges.events.upsert}
                          loading={fetchingEmployees}
                          value={value}
                          onChange={(e, newValue) => onChange(newValue)}
                          options={employees.sort(
                            (a, b) => -b.status.localeCompare(a.status)
                          )}
                          groupBy={employee => employee.status}
                          isOptionEqualToValue={(option, value) => option._id === (value?._id || value)}
                          getOptionLabel={overseer => {
                            if (typeof overseer === "string" && !fetchingEmployees) overseer = employees.find(({ _id }) => _id === overseer)
                            return `${overseer?.names} ${overseer?.lastnames}`
                          }}
                          displayOptionLabel={overseer => `${overseer.names} ${overseer.lastnames}`}
                        />
                      )
                    }
                  />
                </SoftBox>

                <SoftBox mb={1}>
                  <SoftBox ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Participantes
                    </SoftTypography>
                  </SoftBox>
                  <Controller
                    control={control}
                    name="participants"
                    render={
                      ({ field: { ref, value, onChange, ...rest } }) => (
                        <AutocompleteCheckbox
                          {...rest}
                          readOnly={!user.privileges.events.upsert}
                          value={value}
                          options={students.sort(
                            (a, b) =>
                              -b.gradeLevelAttended.localeCompare(
                                a.gradeLevelAttended
                              )
                          )}
                          groupBy={student => student.gradeLevelAttended}
                          loading={fetchingStudents}
                          onChange={(e, newValue) => onChange(newValue)}
                          isOptionEqualToValue={(option, value) => option._id === (value?._id || value)}
                          getOptionLabel={student => {
                            if (typeof student === "string" && !fetchingStudents) student = students.find(({ _id }) => _id === student)
                            return `${student?.names} ${student?.lastnames}`
                          }}
                          displayOptionLabel={student => `${student.names} ${student.lastnames}`}
                        />
                      )
                    }
                  />
                </SoftBox>

                <SoftBox mb={1}>
                  <SoftBox ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Objetivo del Evento
                    </SoftTypography>
                  </SoftBox>
                  <SoftInput
                    {...register("goal")}
                    multiline
                    rows={5}
                    error={!!errors?.goal}
                    placeholder="El objetivo de este es.."
                    readOnly={!user.privileges.events.upsert}
                  />
                  {!!errors?.goal && <SoftTypography ml={0.5} fontSize="small" color="error" fontWeight="light">{errors?.goal.message}</SoftTypography>}
                </SoftBox>

                <SoftBox mb={1}>
                  <SoftBox ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Objetivo del Evento
                    </SoftTypography>
                  </SoftBox>
                  <SoftInput
                    {...register("observations")}
                    multiline
                    rows={5}
                    error={!!errors?.observations}
                    placeholder="El objetivo de este es.."
                    readOnly={!user.privileges.events.upsert}
                  />
                  {!!errors?.observations && <SoftTypography ml={0.5} fontSize="small" color="error" fontWeight="light">{errors?.observations.message}</SoftTypography>}
                </SoftBox>

                <SoftBox mt={3} mb={1} display="flex" justifyContent="flex-between" width="100%">
                  <SoftBox width="100%">
                    {
                      Boolean(Object.keys(event).length) && user.privileges.events.delete &&
                      (
                        <SoftButton loading={isSubmitting} color="error" variant="gradient" onClick={handleDeleteEvent}>
                          <Lock sx={{ mr: 1 }} />
                          Eliminar
                        </SoftButton>
                      )
                    }
                  </SoftBox>
                  <SoftBox display="flex" justifyContent="flex-end" gap={3} width="100%">
                    <SoftButton color="dark" variant="text" onClick={close} sx={{ alignSelf: "center" }}>Cancelar</SoftButton>
                    <SoftButton loading={isSubmitting} color="info" variant="gradient" type="submit">Guardar</SoftButton>
                  </SoftBox>
                </SoftBox>

              </SoftBox>
            </SoftBox>
          </LocalizationProvider>
        </SimpleBar>
      </Card>
    </Modal>
  )
}

export default memo(EventsModal, isEqual);