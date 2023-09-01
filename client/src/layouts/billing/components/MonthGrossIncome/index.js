// Components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Libraries
import { Card } from "@mui/material";
import { memo } from "react";
import isEqual from "react-fast-compare";



const MonthGrossIncome = ({ title, total, badge, color }) => {

  return (
    <Card
      sx={({ functions, palette, breakpoints }) => ({
        height: "100%",
        minHeight: "15rem",
        maxHeight: "18rem",
        p: 2,
        background: functions.linearGradient(palette.gradients[color].main, palette.gradients[color].state),
        width: "100%",
        [breakpoints.between("sm", "xxl")]: {
          width: "auto"
        }
      })}
    >
      <SoftBox display="flex" flexDirection="column" justifyContent="space-around" alignItems="center" m={2} height="100%">
        <SoftTypography variant="button" color="white" textTransform="uppercase" fontSize="large" align="center">
          {title}
        </SoftTypography>
        <SoftTypography variant="button" color="white" textTransform="uppercase" align="center" fontSize="xxx-large">
          {total}
        </SoftTypography>
        <SoftBox variant="gradient" bgColor={badge.color || "dark"} borderRadius="sm" px={3} py={1} display="flex" justifyContent="center">
          <SoftTypography variant="caption" color="white" textTransform="uppercase" align="center" fontSize="small" verticalAlign="middle">
            {badge.label}
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </Card>
  )
}

export default memo(MonthGrossIncome, isEqual);