import { useCallback, useState } from "react";

// Soft UI components
import SoftAvatar from "components/SoftAvatar";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftTypography from "components/SoftTypography";

// Libraries
import { ExpandMore, Visibility, VisibilityOff } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Card, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Modal } from "@mui/material";
import SimpleBar from "simplebar-react";
import { Controller, useForm } from "react-hook-form";
import { defaultsDeep } from "lodash";
import { formatPrivilegesToModalSchema, formatPrivilegesToMongoSchema } from "./UserModal.utils";
import { serialize as formatObjToFormData } from "object-to-formdata";
import { enqueueSnackbar } from "notistack";

const DEFAULT_VALUES = {
  imageUrl: null,
  names: "",
  lastnames: "",
  email: "",
  phones: { main: "" },
  password: "",
  isAdmin: false,
  privileges: {
    reports: {
      label: 'Reportes',
      access: {
        read: {
          label: 'Ver Reportes',
          value: true,
          required: true,
        }
      }
    },
    users: {
      label: 'Usuarios',
      access: {
        read: {
          label: 'Ver Usuarios',
          value: true,
          required: true,
        },
        upsert: {
          label: 'Crear y Editar Usuarios',
          value: false
        },
        delete: {
          label: 'Eliminar Usuarios',
          value: false
        },
      }
    },
    events: {
      label: 'Eventos',
      access: {
        read: {
          label: 'Ver Eventos',
          value: true,
          required: true,
        },
        upsert: {
          label: 'Crear y Editar Eventos',
          value: false
        },
        delete: {
          label: 'Eliminar Eventos',
          value: false
        },
      }
    },
  }
}

const UserModal = ({ title = "", open, close, user = {}, onSubmit: actionOnSubmit = async (data = DEFAULT_VALUES) => await null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [expandAdvancedFeatures, setExpandAdvancedFeatures] = useState(false);
  const { register, setValue, getValues, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: defaultsDeep(
      { ...user, privileges: formatPrivilegesToModalSchema(user?.privileges || {}) },
      DEFAULT_VALUES
    ),
  });

  // console.log(formatPrivilegesToModalSchema(defaultValues));

  const onSubmit = async data => {
    setIsLoading(true);
    // Add missing properties
    data.fullname = `${data.names} ${data.lastnames}`;
    // Format data to Mongoose Schema
    data.privileges = formatPrivilegesToMongoSchema(data.privileges);

    const formData = formatObjToFormData(data, { nullsAsUndefineds: true });

    try {
      const response = await actionOnSubmit(formData);
      if (!response?.ok) throw new Error(response.message);
      enqueueSnackbar("Se ha creado el usuario con exito", { variant: "success" });
      close();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpandAdvanceFeatures = () => setExpandAdvancedFeatures(!expandAdvancedFeatures);

  const renderPasswordVisibilityIcon = () => {
    return visiblePassword ?
      <Visibility />
      :
      <VisibilityOff />
  }

  const getAllPrivilegesStatus = useCallback(() => (
    Object.values(getValues("privileges"))
      .flatMap(({ access }) => {
        return Object.values(access).map(({ value }) => value)
      })
  ), [getValues]);

  const setAdminPrivileges = useCallback(() => {
    const nextValue = !(getAllPrivilegesStatus().every(Boolean));
    const allPrivileges = Object.fromEntries(Object.entries(getValues("privileges")).map(([key, { label, access }]) => {
      const setValue = Object.fromEntries(Object.entries(access).map(([accessKey, values]) => {
        return [accessKey, { ...values, value: (values.required || nextValue) }]
      }));
      return [key, { label, access: setValue }];
    }));

    setValue("privileges", allPrivileges);
    setValue("isAdmin", nextValue);
  }, [getAllPrivilegesStatus, getValues, setValue]);

  const renderPrivilegesCheckbox = useCallback(() => {
    return Object.entries(getValues("privileges")).map(([key, { label, access }]) => {
      const items = Object.entries(access).map(([accessKey, { label: accessLabel, required }]) => {
        // Checks if all privileges are selected and sets isAdmin property
        const handleOnChange = (onChangeHook) => (...e) => {
          onChangeHook(...e)
          const hasAllPrivileges = getAllPrivilegesStatus().every(Boolean);
          setValue("isAdmin", hasAllPrivileges);
        }
        return (
          <Controller
            key={accessKey}
            control={control}
            name={`privileges.${key}.access.${accessKey}.value`}
            render={({
              field: { onChange, onBlur, value, ref },
            }) => (
              <FormControlLabel
                label={
                  <SoftTypography variant="button" fontWeight="regular">
                    {accessLabel}
                  </SoftTypography>
                }
                control={
                  <Checkbox
                    checked={required || value}
                    disabled={required}
                    onBlur={onBlur} // notify when input is touched
                    onChange={handleOnChange(onChange)} // send value to hook form
                    inputRef={ref}
                  />
                }
              />)
            }
          />
        )
      })

      return (
        <Grid item xs={12} sm={6} key={key}>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              <SoftTypography variant="button" fontWeight="medium">
                {label}
              </SoftTypography>
            </FormLabel>
            <FormGroup>
              {items}
            </FormGroup>
          </FormControl>
        </Grid>
      )
    })
  }, [control, getAllPrivilegesStatus, getValues, setValue])

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
          width: '500px',
          maxWidth: '100%',
          maxHeight: "100%",
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          [theme.breakpoints.down("md")]: {
            height: "100%",
            borderRadius: 0,
          },
        })}
      >
        <SimpleBar style={{
          maxHeight: "100vh",
          width: "content-width",
        }}>
          <SoftBox p={3}>
            <SoftTypography variant="h4" fontWeight="medium" textTransform="capitalize" gutterBottom>
              {title}
            </SoftTypography>
            <SoftBox>

              <SoftBox display="flex" mb={2}>
                <SoftBox mr={3} display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                  <SoftBox sx={{ position: "relative" }}>
                    <Controller
                      control={control}
                      name="imageUrl"
                      render={({ field: { onChange, value } }) => (
                        <SoftButton component="label" variant="text" sx={{ p: 0 }}>
                          <SoftAvatar
                            size="xxxl"
                            variant="rounded"
                            shadow="md"
                            bgColor={value ? "transparent" : "dark"}
                            src={value && (typeof value === 'string' ? value : URL.createObjectURL(value))}
                          />
                          <input
                            hidden
                            accept="image/,.jpg,.jpeg,.png,.gif,.webp"
                            type="file"
                            onChange={e => setValue("imageUrl", e.target.files[0])}
                          />
                          <SoftBox
                            sx={{
                              display: !value && "none",
                              position: "absolute",
                              zIndex: 1300,
                              width: "100%",
                              bottom: 0,
                            }}
                          >
                            <SoftButton
                              color="white"
                              variant="text"
                              onClick={() => setValue("imageUrl", null)}
                              p={0}
                              sx={{
                                width: "100%",
                                borderRadiusBottom: 0,
                                "&, :hover": {
                                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                                }
                              }}
                            >
                              Quitar Imagen
                            </SoftButton>
                          </SoftBox>
                        </SoftButton>
                      )}
                    />
                  </SoftBox>
                </SoftBox>
                <SoftBox display="flex" flexDirection="column" width="100%" mb={2}>
                  <SoftBox width="100%">
                    <SoftBox ml={0.5}>
                      <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                        Nombre*
                      </SoftTypography>
                    </SoftBox>
                    <SoftInput
                      {...register("names", { required: "Este campo es obligatorio" })}
                      placeholder="Nombres"
                      error={!!errors?.names}
                    />
                    {!!errors?.names && <SoftTypography fontSize="small" color="error" fontWeight="light">{errors?.names.message}</SoftTypography>}
                  </SoftBox>
                  <SoftBox width="100%">
                    <SoftBox ml={0.5}>
                      <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                        Apellido*
                      </SoftTypography>
                    </SoftBox>
                    <SoftInput
                      {...register("lastnames", { required: "Este campo es obligatorio" })}
                      error={!!errors?.lastnames}
                      placeholder="Apellidos"
                    />
                    {!!errors?.lastnames && <SoftTypography fontSize="small" color="error" fontWeight="light">{errors?.lastnames.message}</SoftTypography>}
                  </SoftBox>
                </SoftBox>
              </SoftBox>

              <SoftBox display="flex" justifyContent="space-between" gap={2} width="100%" mb={2}>
                <SoftBox width="100%">
                  <SoftBox ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Email*
                    </SoftTypography>
                  </SoftBox>
                  <SoftInput
                    {...register("email", { required: "Este campo es obligatorio" })}
                    type="email"
                    error={!!errors?.email}
                    placeholder="Email"
                  />
                  {!!errors?.email && <SoftTypography fontSize="small" color="error" fontWeight="light">{errors?.email.message}</SoftTypography>}
                </SoftBox>
                <SoftBox width="100%">
                  <SoftBox ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Telefono
                    </SoftTypography>
                  </SoftBox>
                  <SoftInput
                    {...register("phones.main")}
                    type="tel"
                    placeholder="Telefono"
                  />
                </SoftBox>
              </SoftBox>

              <SoftBox mb={2}>
                <SoftBox ml={0.5}>
                  <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                    Contraseña{Object.keys(user).length === 0 && "*"}
                  </SoftTypography>
                </SoftBox>
                <SoftInput
                  type={visiblePassword ? 'text' : 'password'}
                  {...register(
                    "password",
                    {
                      required: {
                        value: Object.keys(user).length === 0,
                        message: "Este campo es obligatorio",
                      },
                      minLength: {
                        value: 8,
                        message: "La contraseña debe contener al menos 8 caracteres"
                      }
                    }
                  )}
                  error={!!errors?.password}
                  placeholder="Contraseña"
                  icon={{
                    component: renderPasswordVisibilityIcon(),
                    direction: "right",
                    onClick: () => setVisiblePassword(!visiblePassword),
                  }}
                />
                {!!errors?.password && <SoftTypography fontSize="small" color="error" fontWeight="light">{errors?.password.message}</SoftTypography>}
              </SoftBox>

              <SoftBox mb={2}>
                <Accordion expanded={expandAdvancedFeatures} onChange={handleExpandAdvanceFeatures} sx={{ boxShadow: 'none' }}>
                  <AccordionSummary
                    expandIcon={<ExpandMore fontSize="medium" />}
                    aria-controls="advanced-options-content"
                    id="advanced-options"
                  >
                    <SoftBox display="flex" flexDirection="column">
                      <SoftTypography fontSize="1rem" fontWeight="medium">
                        Configuraciones Avanzadas
                      </SoftTypography>
                      <SoftTypography fontSize="small" fontWeight="light">
                        Privilegios de la cuenta
                      </SoftTypography>
                    </SoftBox>
                  </AccordionSummary>
                  <AccordionDetails>
                    <SoftBox>
                      <Controller
                        control={control}
                        name="isAdmin"
                        render={({ field: { onChange, onBlur, value, name, ref } }) => (
                          <FormControlLabel
                            label={<SoftTypography fontSize="medium" fontWeight="medium">Administrador</SoftTypography>}
                            control={
                              <Checkbox
                                checked={value || getAllPrivilegesStatus().every(Boolean)}
                                indeterminate={getAllPrivilegesStatus().some(Boolean)}
                                onChange={setAdminPrivileges}
                                onBlur={onBlur}
                                inputRef={ref}
                              />
                            }
                            sx={{
                              width: "fit-content"
                            }}
                          />
                        )}
                      />
                      <Divider />
                      <Grid container>
                        {renderPrivilegesCheckbox()}
                      </Grid>
                    </SoftBox>
                  </AccordionDetails>
                </Accordion>
              </SoftBox>

              <SoftBox mb={2} display="flex" justifyContent="flex-end" gap={3}>
                <SoftButton color="dark" variant="text" onClick={close} sx={{ alignSelf: "center" }}>Cancelar</SoftButton>
                <SoftButton loading={isLoading} color="info" variant="gradient" type="submit">Guardar</SoftButton>
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </SimpleBar>
      </Card>
    </Modal>
  )
}

export default UserModal;