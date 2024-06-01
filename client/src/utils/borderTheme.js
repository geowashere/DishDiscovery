import { createTheme } from '@mui/material/styles'
import { outlinedInputClasses } from '@mui/material/OutlinedInput'
export const borderTheme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: '#333329',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        InputProps: {
          sx: {
            '&.Mui-disabled .MuiInputBase-input': {
              fontSize: '1.5rem',
            },
          },
        },
      },
    },
  },
})
