import { useEffect, useMemo, useState } from "react";

// Libraries
import { DateTime, Info } from "luxon";
import lodash from "lodash";

// @mui material components
import Grid from "@mui/material/Grid";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Billing page components
import MonthGrossIncome from "./components/MonthGrossIncome";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import ProgressLineChart from "examples/Charts/LineCharts/ProgressLineChart";
import ProgressDoughnutChart from "examples/Charts/DoughnutCharts/ProgressDoughnutChart";
import { DateRange, WorkspacePremium } from "@mui/icons-material";
import AnnouncementGroup from "./components/AnnouncementGroup";
import BillingTable from "./components/BillingTable";

// Hooks & Contexts
import { useDebts } from "context/debts.context";
import { usePayments } from "context/payments.context";
import { useNotifications } from "context/notifications.context";

// Utils
import { getCurrentSchoolTerm, getFormerSchoolTerm, formatCurrency, formatPercentage } from "utils/functions.utils";
import useStudents from "hooks/students.hooks";


// Creador de formato de notificaciones por deudas
const INITIAL_OPTIONS = {
  minDebtsPending: 4,
}
const createDebtNotifications = (debts = [], options = INITIAL_OPTIONS) => {
  if (!debts.length) return debts; // Si no existen notificaciones se finaliza instanteneamente
  const optionsConfig = lodash.merge(INITIAL_OPTIONS, options);

  // Plantilla para entregar las deudas en formato del Announcement component
  const configDebtsNotifications = (student, notificationDebts) => ({
    id: student.fullname,
    badge: { color: 'error', label: 'alerta' },
    // action: { label: 'alertar', onClick: () => console.log('Clicked') },
    by: {
      imageUrl: student?.imageUrl,
      fullname: lodash.capitalize(`${student.names} ${student.lastnames}`),
      date: student.isActive ? 'INSCRITO' : 'NO INSCRITO',
    },
    title: `${lodash.capitalize(student.names.split(' ').at(0))} posee ${notificationDebts.length} deudas`,
    description: `Los conceptos de deudas son: ${notificationDebts.map(debt => (debt.concept).split('-').at(1)).join(', ')}`,
    value: { type: '$', amount: notificationDebts.reduce((total, debt) => total + debt.amount.pending.usd, 0).toFixed(2) }
  });

  return debts.reduce((notifications, { student, debts: studentDebts }) => {
    if (studentDebts.length < optionsConfig.minDebtsPending) return notifications;

    notifications.push(configDebtsNotifications(student, studentDebts));
    return notifications;
  }, [])
};

// Estos dias estan establecidos en el calendario latino
const WEEK_DAYS_MAP = {
  short: Info.weekdays("short", { locale: "es" }), // lun-dom
  long: Info.weekdays("long", { locale: "es" }), // lunes-domingo
}

const Billing = () => {
  const { debts } = useDebts();
  const { payments } = usePayments();
  const { students } = useStudents();
  const { notifications } = useNotifications();
  const [debtsConfig, setDebtsConfig] = useState({
    student: 0,
    schoolTerm: 0,
  });
  const [paymentsConfig, setPaymentsConfig] = useState({
    day: {
      income: 0,
      increment: {
        value: 0,
        label: null,
        color: 'success',
      }
    },
    week: {
      income: 0,
      increment: {
        value: 0,
        label: null,
        color: 'success',
      },
      dailyIncome: WEEK_DAYS_MAP.short.reduce((weekdays, day, idx) => {
        const WORK_DAYS = ['lun', 'mar', 'mié', 'jue', 'vie']; // Dias que se laborales en colegio
        if (!WORK_DAYS.includes(day)) return weekdays; // Buscamos solamente dia laborales, sab-dom no

        // Obtenemos la fecha en el lunes de la semana actual
        const currentWeekMonday = DateTime.now().startOf('week');
        // Obtenemos la fecha del dia en la semana
        const weekDayDate = currentWeekMonday
          .plus({ days: idx }) // Agregamos de 0-6 los dias dependiendo del dia: Lun-Vie
          .setLocale('es') // Lo convertimos a fecha Hispana
          .toLocaleString(DateTime.DATE_SHORT); // Establecemos el formato usado en el servidor

        weekdays.push({
          date: weekDayDate,
          label: day,
          income: 0,
        })
        return weekdays;
      }, [])
    },
    month: {
      income: 0,
      increment: {
        value: 0,
        label: null,
        color: 'success',
      }
    },
    schoolTerm: {
      income: 0,
      increment: {
        value: 0,
        label: null,
        color: 'success',
      }
    },
  });
  const [debtsNotifications, setDebtsNotifications] = useState([]);

  const currentSchoolTerm = useMemo(() => getCurrentSchoolTerm(), []);
  const formerSchoolTerm = useMemo(() => getFormerSchoolTerm(), []);
  const todayDT = useMemo(() => DateTime.now().setLocale('es'), []);

  // Buscamos los pagos de las inscripciones del mes actual
  const currentMonthTotalInscriptionsPayed = useMemo(() => {
    return payments.filter(payment => {
      const conceptIsForCurrentMonth = payment.concept.toLowerCase().includes(todayDT.monthLong);
      return payment.schoolTerm === currentSchoolTerm && conceptIsForCurrentMonth;
    }).length
  }, [currentSchoolTerm, payments, todayDT.monthLong])
  const totalInscriptions = useMemo(() => students.filter(student => student.isActive).length, [students])

  // Calculo de Deudas
  useEffect(() => {
    const getTotalDebt = debtsArray => debtsArray.reduce((total, debt) => total + debt.amount.pending.usd, 0);
    const getDebtsBySchoolTerm = (debtsArray, term) => debtsArray.filter(debt => debt.schoolTerm === term)

    if (debts.length) {
      setDebtsConfig({
        student: getTotalDebt(debts),
        schoolTerm: getTotalDebt(getDebtsBySchoolTerm(debts, currentSchoolTerm)),
      })
    }
  }, [debts, currentSchoolTerm, formerSchoolTerm])

  // Calculo de Pagos
  useEffect(() => {
    const sumTotalPayments = array => Number(array.reduce((total, payment) => total + payment.amount.usd, 0).toFixed(2));

    const getIncomeByDate = (paymentsArray, date) => {
      const filteredPaymentsByDay = paymentsArray.filter(payment => payment.time.date === date);

      return sumTotalPayments(filteredPaymentsByDay);
    }

    const getIncomeByWeekNumber = (paymentsArray, weekNumber, term = currentSchoolTerm) => {
      const filteredPaymentsByWeek = paymentsArray.filter(payment => {
        const weekPayments = DateTime.fromFormat(payment.time.date, 'd/M/yyyy').weekNumber === weekNumber;
        return payment.schoolTerm === term && weekPayments;
      });

      return sumTotalPayments(filteredPaymentsByWeek);
    }

    const getIncomeByMonth = (paymentsArray, monthNumber, term = currentSchoolTerm) => {
      const filteredPaymentsByMonth = paymentsArray.filter(payment => {
        const monthPayments = DateTime.fromFormat(payment.time.date, 'd/M/yyyy').month === monthNumber;
        return payment.schoolTerm === term && monthPayments;
      });

      return sumTotalPayments(filteredPaymentsByMonth);
    }

    const getIncomeBySchoolTerm = (paymentsArray, term) => {
      const filteredPaymentsBySchoolTerm = paymentsArray.filter(payment => payment.schoolTerm === term);

      return sumTotalPayments(filteredPaymentsBySchoolTerm);
    }

    // El @targetIncome es el nuevo valor que buscamos calcular su diferencia con
    // el @sourceIncome el cual es el valor anterior y sera la base para calcular la diferencia 
    const getIncomeDiff = (targetIncome, sourceIncome) => {
      // Si el sourceIncome es 0 el valor da Infinity
      const incomeDiff = sourceIncome > 0 ? (targetIncome / sourceIncome) - 1 : 0; // El 1 representa el 100% base, por lo que al quitarselo obtenemos cuando fue el cambio

      return {
        value: incomeDiff,
        label: (incomeDiff !== Infinity && incomeDiff !== 0) ? formatPercentage(incomeDiff) : null, // Puede obtenerse valores antiguos no agregados a la BDD
        color: incomeDiff > 0 ? 'success' : 'error',
      }
    }

    if (payments.length) {
      setPaymentsConfig({
        day: {
          income: getIncomeByDate(payments, todayDT.toLocaleString(DateTime.DATE_SHORT)),
          increment: getIncomeDiff(
            getIncomeByDate(payments, todayDT.toLocaleString(DateTime.DATE_SHORT)),
            getIncomeByDate(payments, todayDT.minus({ days: 1 }).toLocaleString(DateTime.DATE_SHORT))
          )
        },
        week: {
          income: getIncomeByWeekNumber(payments, DateTime.now().weekNumber),
          increment: getIncomeDiff(
            getIncomeByWeekNumber(payments, DateTime.now().weekNumber),
            getIncomeByWeekNumber(payments, DateTime.now().minus({ weeks: 1 }).weekNumber)
          ),
          dailyIncome: paymentsConfig.week.dailyIncome.map((day) => ({
            ...day,
            income: getIncomeByDate(payments, day.date)
          }))
        },
        month: {
          income: getIncomeByMonth(payments, DateTime.now().month),
          increment: getIncomeDiff(
            getIncomeByMonth(payments, DateTime.now().month),
            getIncomeByMonth(payments, DateTime.now().minus({ months: 1 }).month)
          ),
        },
        schoolTerm: {
          income: getIncomeBySchoolTerm(payments, currentSchoolTerm),
          increment: getIncomeDiff(
            getIncomeBySchoolTerm(payments, currentSchoolTerm),
            getIncomeBySchoolTerm(payments, formerSchoolTerm)
          ),
        },
      })
    }
    //! Si se agrega la dependencia paymentsConfig.week.dailyIncome se crea un loop infinito por la instancia de un objeto nuevo en el state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSchoolTerm, formerSchoolTerm, payments, todayDT])

  // Calculo de Notificaciones por Deudas
  useEffect(() => {
    if (notifications.debts.length) setDebtsNotifications(createDebtNotifications(notifications.debts, { minDebtsPending: 6 }));
  }, [notifications.debts])

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox mt={4}>
        <SoftBox mb={1.5}>
          <Grid container spacing={3}>
            <Grid container item xs={12} lg={8} spacing={3}>
              <Grid container item spacing={3} xs={12}>

                <Grid container item xs={12} xxl={4} spacing={2}>
                  <Grid item xs={12} md={debtsNotifications.length ? 6 : 12} lg={12}>
                    <MonthGrossIncome
                      title={`Ingresos ${todayDT.monthLong}`}
                      total={formatCurrency(paymentsConfig.month.income, { maximumFractionDigits: 0 })}
                      badge={{ color: "dark", label: `${paymentsConfig.month.increment.label ?? '0 %'} desde el ultimo mes` }}
                      color="info"
                    />
                  </Grid>

                  {
                    !!debtsNotifications.length &&
                    (
                      <Grid item xs={12} md={6} display={{ lg: 'none' }}>
                        <AnnouncementGroup announcements={debtsNotifications} />
                      </Grid>
                    )
                  }
                </Grid>

                <Grid item container xs={12} xxl={8} spacing={2} justifyContent="center">

                  <Grid container item xs={12} md={6} spacing={2}>
                    <Grid item xs={12} sm={6} md={12}>
                      <MiniStatisticsCard
                        title={{ text: "Ingresos de hoy" }}
                        count={formatCurrency(paymentsConfig.day.income, { maximumFractionDigits: 2 })}
                        percentage={{ color: paymentsConfig.day.increment.color, text: paymentsConfig.day.increment.label }}
                        icon={{ color: "info", component: "paid" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={12}>
                      <MiniStatisticsCard
                        title={{ text: `Ingresos ${currentSchoolTerm}` }}
                        count={formatCurrency(paymentsConfig.schoolTerm.income, { maximumFractionDigits: 2 })}
                        percentage={{ color: paymentsConfig.schoolTerm.increment.color, text: paymentsConfig.schoolTerm.increment.label }}
                        icon={{ color: "info", component: "paid" }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container item xs={12} md={6} spacing={2}>
                    <Grid item xs={12} sm={6} md={12}>
                      <MiniStatisticsCard
                        title={{ text: "Deuda Estudiantil" }}
                        count={formatCurrency(debtsConfig.student, { maximumFractionDigits: 2 })}
                        icon={{ color: "error", component: "paid" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={12}>
                      <MiniStatisticsCard
                        title={{ text: `Deuda ${currentSchoolTerm}` }}
                        count={formatCurrency(debtsConfig.schoolTerm, { maximumFractionDigits: 2 })}
                        icon={{ color: "error", component: "paid" }}
                      />
                    </Grid>
                  </Grid>

                </Grid>

              </Grid>

              <Grid item xs={12}>
                <BillingTable />
              </Grid>
            </Grid>
            <Grid container item xs={12} lg={4} spacing={3} height="fit-content">
              {
                !!debtsNotifications.length &&
                (
                  <Grid item xs={12}>
                    <AnnouncementGroup announcements={debtsNotifications} />
                  </Grid>
                )
              }
              <Grid item xs={12}>
                <ProgressLineChart
                  icon={<DateRange fontSize="medium" />}
                  title="Ingreso Semanal"
                  count={formatCurrency(paymentsConfig.week.income, { maximumFractionDigits: 2 })}
                  height="10rem"
                  chart={{
                    labels: paymentsConfig.week.dailyIncome.map(({ label }) => lodash.capitalize(label)),
                    data: paymentsConfig.week.dailyIncome.map(({ income }) => income),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <ProgressDoughnutChart
                  icon={<WorkspacePremium fontSize="medium" />}
                  title={`Mensualidad de ${lodash.capitalize(todayDT.monthLong)}`}
                  count={`${currentMonthTotalInscriptionsPayed}/${totalInscriptions}`}
                  chart={{
                    labels: ["Pagadas", "Faltantes"],
                    datasets: {
                      label: "Mensualidad Marzo",
                      backgroundColors: ["info", "secondary"],
                      data: [
                        currentMonthTotalInscriptionsPayed,
                        totalInscriptions - currentMonthTotalInscriptionsPayed,
                      ],
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
