import TextField from '@mui/material/TextField'
import type { TextFieldProps } from '@mui/material/TextField'

type AppInputProps = TextFieldProps & {
  label: string
}

export default function AppInput({ label, ...props }: AppInputProps) {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      size="small"
      {...props}
    />
  )
}
