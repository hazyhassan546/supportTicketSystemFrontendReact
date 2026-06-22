import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import type { SelectProps } from '@mui/material/Select'

export type DropdownOption = {
  label: string
  value: string | number
}

type AppDropdownProps = Omit<SelectProps, 'label'> & {
  label: string
  options: DropdownOption[]
  helperText?: string
}

export default function AppDropdown({
  label,
  options,
  helperText,
  error,
  ...props
}: AppDropdownProps) {
  const labelId = `${label.toLowerCase().replace(/\s+/g, '-')}-label`

  return (
    <FormControl fullWidth size="small" error={error}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select labelId={labelId} label={label} {...props}>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}
