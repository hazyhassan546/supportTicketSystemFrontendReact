import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import type { ButtonProps } from '@mui/material/Button'

type AppButtonProps = ButtonProps & {
  loading?: boolean
}

export default function AppButton({ loading, disabled, children, ...props }: AppButtonProps) {
  return (
    <Button disabled={loading || disabled} {...props}>
      {loading ? <CircularProgress size={20} color="inherit" /> : children}
    </Button>
  )
}
