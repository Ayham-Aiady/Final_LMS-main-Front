import { createContext, useContext, useMemo, useState } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleColorMode = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        ...(mode === 'dark'
          ? {
              background: {
                default: '#111827', // matches your navbar
                paper: '#1f2937'    // dark card surfaces
              },
              text: {
                primary: '#f1f5f9',
                secondary: '#cbd5e1'
              }
            }
          : {
              background: {
                default: '#f9fafb',
                paper: '#ffffff'
              }
            })
      },
      typography: {
        fontFamily: 'Inter, Roboto, sans-serif'
      }
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ toggleColorMode, mode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
