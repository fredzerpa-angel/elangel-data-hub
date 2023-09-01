import { useEffect, useRef, useState } from "react";

import { Menu, MenuItem } from "@mui/material";
import { FileDownload } from "@mui/icons-material";

import MaterialReactTable from "material-react-table";
//Import Material React Table Translations
import { MRT_Localization_ES } from "material-react-table/locales/es";

import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";

import colors from "assets/theme/base/colors";

const ExportsMenu = ({ exportAllRows, exportSelectedRows }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const handleExportByTable = async () => {
    await exportAllRows();
    closeMenu();
  }

  const handleExportByRows = async () => {
    await exportSelectedRows();
    closeMenu();
  }

  return (
    <SoftBox>
      <SoftButton size="small" variant="text" color="dark" circular onClick={openMenu}>
        <FileDownload sx={{ height: "1.5rem", width: "1.5rem" }} />
      </SoftButton>
      <Menu anchorEl={anchorEl} open={open} onClose={closeMenu}>
        <MenuItem onClick={handleExportByTable}>Exportar tabla</MenuItem>
        <MenuItem onClick={handleExportByRows}>Exportar por filas</MenuItem>
      </Menu>
    </SoftBox>
  );
}

const DataTable = ({ columns, data, isLoading, ...props }) => {
  const tableContainerRef = useRef(null); // we can get access to the underlying TableContainer element and react to its scroll events
  const rowVirtualizerInstanceRef = useRef(null); // we can get access to the underlying Virtualizer instance and call its scrollToIndex method
  const [sorting, setSorting] = useState([]);


  // scroll to top of table when sorting or filters change
  useEffect(() => {
    try {
      // scroll to the top of the table when the sorting changes
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting]);

  return (
    <MaterialReactTable
      // Custom props
      columns={columns}
      data={data}
      localization={MRT_Localization_ES}
      renderTopToolbarCustomActions={() => <ExportsMenu />}
      initialState={{ density: "compact", columnVisibility: { id: false } }}
      enableDensityToggle={false}
      positionToolbarAlertBanner="top"
      enableRowSelection
      enablePagination={false}
      enableRowVirtualization // optional, but recommended if it is likely going to be more than 100 rows
      enableBottomToolbar={false}
      muiTableContainerProps={{
        ref: tableContainerRef, // get access to the table container element
        // Sobreescribimos los estilos del scroll
        sx: {
          height: '500px',
          '::-webkit-scrollbar': {
            width: '8px' /* Tamaño del scroll en vertical */,
            height: '8px' /* Tamaño del scroll en horizontal */,
            // display: 'none' /* Ocultar scroll */,
          },
          /* Ponemos un color de fondo y redondeamos las esquinas del thumb */
          '::-webkit-scrollbar-thumb': {
            background: '#ccc',
            borderRadius: '4px',
          },

          /* Cambiamos el fondo y agregamos una sombra cuando esté en hover */
          '::-webkit-scrollbar-thumb:hover': {
            background: '#b3b3b3',
            boxShadow: '0 0 2px 1px rgba(0, 0, 0, 0.2)',
          },

          /* Cambiamos el fondo cuando esté en active */
          '::-webkit-scrollbar-thumb:active': {
            backgroundColor: '#999999',
          },
        },
      }}
      muiToolbarAlertBannerProps={
        props?.isError
          ? {
            color: 'error',
            children: 'Error en la carga de datos',
          }
          : undefined
      }
      onSortingChange={setSorting}
      state={{
        isLoading,
        showAlertBanner: props?.isError,
        showProgressBars: isLoading,
        sorting,
      }}
      rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //get access to the virtualizer instance
      rowVirtualizerProps={{ overscan: 4 }}
      // Sobreescribimos los estilos predefinidos de la libreria
      muiLinearProgressProps={{ color: 'info' }}
      muiTablePaperProps={{ elevation: 0 }}
      muiTopToolbarProps={{ sx: { backgroundColor: 'inherit' } }}
      muiTableProps={{ sx: { '&, & thead, & tr': { backgroundColor: 'inherit' } } }}
      muiTableHeadProps={{ sx: { padding: 0 } }}
      muiTableBodyRowProps={({ isDetailPanel, row, table }) => {
        // Cambia el estilo del select y hover en las filas
        if (row.getIsSelected()) {
          return {
            sx: {
              backgroundColor: `${colors.background.default}!important`,
              '&:hover td': {
                backgroundColor: `${colors.info.focus}!important`,
              }
            }
          }
        }
      }}
      muiSelectAllCheckboxProps={{ sx: { width: 'auto', height: 'inherit' } }}
      muiSelectCheckboxProps={{ sx: { width: 'auto', height: 'inherit' } }}
      muiSearchTextFieldProps={{
        sx: {
          '& > .MuiInputBase-root': {
            padding: '0.5rem 0.75rem!important',
            justifyContent: 'space-between',
            '&:after': {
              borderColor: colors.info.main
            }
          },
        },
      }}
      muiTableHeadCellFilterTextFieldProps={{
        sx: {
          '& > .MuiInputBase-root': {
            padding: '0.5rem 0.75rem!important',
            justifyContent: 'space-between',
          },
        },
      }}
      muiTablePaginationProps={{
        SelectProps: {
          sx: {
            width: 'auto!important',
          },
        },
      }}
      {...props}
    />
  );
}

export default DataTable;