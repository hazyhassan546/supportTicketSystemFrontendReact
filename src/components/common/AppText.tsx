import Typography from '@mui/material/Typography'
import type { TypographyProps } from '@mui/material/Typography'

type AppTextProps = TypographyProps & {
  children: React.ReactNode
}

export default function AppText({ children, ...props }: AppTextProps) {
  return <Typography {...props}>{children}</Typography>
}
