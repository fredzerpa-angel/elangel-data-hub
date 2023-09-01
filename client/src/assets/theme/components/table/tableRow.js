/**
=========================================================
* Soft UI Dashboard React - v3.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Soft UI Dashboard React base styles
import borders from "assets/theme/base/borders";
import colors from "assets/theme/base/colors";

// Soft UI Dashboard React helper functions
import pxToRem from "assets/theme/functions/pxToRem";
import rgba from "assets/theme/functions/rgba";

const { borderWidth } = borders;
const { info, light } = colors;

const tableRow = {
  styleOverrides: {
    root: {
      "&.Mui-selected": {
        backgroundColor:  rgba(info.main, 0.08),
        "&:hover, &:hover td": {
          backgroundColor: rgba(info.focus, 0.12),
        }
      },
    },
  },
};

export default tableRow;
