import { ThemeProvider, CssBaseline } from '@mui/material'
import { Provider } from 'react-redux'
import { store } from './store'
import theme from './theme'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginPage />
      </ThemeProvider>
    </Provider>
  )
}

export default App
