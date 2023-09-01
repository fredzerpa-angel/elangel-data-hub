import { useCallback, useEffect, useMemo, useState } from "react";

// Libraries
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AppBar, Card, Tab, Tabs } from "@mui/material";
import { Description, Payments } from "@mui/icons-material";
import { DateTime } from "luxon";

// Components
import DataTable from "components/DataTable";

// Hooks & Contexts
import { usePayments } from "context/payments.context";
import { useDebts } from "context/debts.context";
import { formatCurrency } from "utils/functions.utils";

const BillingTable = () => {
  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const { debts, isLoading: isLoadingDebts, errors: debtsErrors } = useDebts();
  const { payments, isLoading: isLoadingPayments, errors: paymentsErrors } = usePayments();

  const isLoadingData = useMemo(() => isLoadingDebts || isLoadingPayments, [isLoadingDebts, isLoadingPayments])
  const isError = useMemo(() => debtsErrors.length || paymentsErrors.length, [debtsErrors, paymentsErrors])

  useEffect(() => {
    console.log({ debts });
    console.log({ payments });
  }, [debts, payments])

  const TABS_MAP = useMemo(() => [
    {
      label: "Pagos",
      icon: <Payments fontSize="medium" />,
      data: payments,
      columns: [
        {
          accessorKey: "schoolTerm",
          header: "Año Escolar",
        },
        {
          accessorKey: "concept",
          header: "Concepto",
        },
        {
          accessorKey: "student.fullname",
          header: "Estudiante",
          size: 400,
        },
        {
          accessorKey: "amount.usd",
          header: "Monto",
          size: 120,
          Cell: ({ cell, ...rest }) => (<>{formatCurrency(cell.getValue(), { maximumFractionDigits: 2 })}</>),
        },
        {
          accessorKey: "discount.usd",
          header: "Descuento",
          Cell: ({ cell, ...rest }) => (<>{formatCurrency(cell.getValue(), { maximumFractionDigits: 2 })}</>),
        },
        {
          accessorKey: "paymentHolder.fullname",
          header: "Titular del Pago",
          size: 400,
        },
        {
          accessorKey: "paymentHolder.documentId.number",
          header: "Titular ID",
          size: 150,
        },
        {
          accessorKey: "time.date",
          header: "Fecha",
          size: 120,
        },
        {
          accessorKey: "time.hour",
          header: "Hora",
          size: 120,
          Cell: ({ cell, ...rest }) => (<>{DateTime.fromFormat(cell.getValue(), 'TT').toFormat('t')}</>),
        },
        {
          accessorKey: "isCredit",
          header: "Es Credito",
          Cell: ({ cell, ...rest }) => (<>{cell.getValue() ? 'Si' : 'No'}</>),
        },
      ],
    },
    {
      label: "Deudas",
      icon: <Description fontSize="medium" />,
      data: debts.filter(debt => debt.status.pending),
      columns: [
        {
          accessorKey: "schoolTerm",
          header: "Año Escolar",
        },
        {
          accessorKey: "concept",
          header: "Concepto",
        },
        {
          accessorKey: "amount.pending.usd",
          header: "Monto",
          size: 120,
          Cell: ({ cell, ...rest }) => (<>{formatCurrency(cell.getValue(), { maximumFractionDigits: 2 })}</>),
        },
        {
          accessorKey: "student.fullname",
          header: "Estudiante",
          size: 400,
        },
        {
          accessorKey: "student.email",
          header: "Correo",
          size: 400,
        },
        {
          accessorKey: "student.gradeLevelAttended",
          header: "Grado",
        },
        {
          accessorKey: "student.discountPlan",
          header: "Plan de Descuento",
          size: 200,
        },
        {
          accessorKey: "student.paymentPlan",
          header: "Plan de Pago",
        },
        {
          accessorKey: "student.isActive",
          header: "Inscrito",
          Cell: ({ cell, ...rest }) => (<>{cell.getValue() ? 'Si' : 'No'}</>),
        },
      ],
    },
  ], [debts, payments]);

  // Seleccionamos las columnas al crear la tabla y al actualizar el tab
  useEffect(() => {
    const tab = TABS_MAP[tabValue];
    setColumns(tab.columns);
    // Seleccionamos el tipo de data a mostrar en la tabla
    const data = tab.data;
    setData(data);
  }, [TABS_MAP, tabValue])

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  // Creamos el cliente para crear una tabla infinita con useInfiniteQuery de react-query
  const queryClient = new QueryClient();

  return (
    <Card
      sx={{
        width: "100%",
      }}
    >
      <AppBar position="static">
        <Tabs
          orientation="horizontal"
          value={tabValue}
          onChange={handleSetTabValue}
          sx={{ p: 0, borderRadius: 0 }}
          TabIndicatorProps={{
            sx: { borderRadius: 0 }
          }}
        >
          {TABS_MAP.map(({ label, icon }) => <Tab key={label} label={label} icon={icon} sx={{ p: 1 }} />)}
        </Tabs>
      </AppBar>
      <QueryClientProvider client={queryClient}>
        <DataTable columns={columns} data={data} isLoading={isLoadingData} isError={isError} />
      </QueryClientProvider>
    </Card>
  );
}

export default BillingTable;