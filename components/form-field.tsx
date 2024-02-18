import { cn } from '@/lib/utils'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

export type FieldProps = {
  label?: string
  multiline?: boolean
  inputClassName?: string
  message?: string
} & React.ComponentProps<typeof Input> &
  React.ComponentProps<typeof Textarea>

const FormField: React.FC<FieldProps> = ({
  label,
  multiline = false,
  className = '',
  inputClassName = '',
  message = '',
  ...props
}) => {
  const Comp = multiline ? Textarea : Input

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label htmlFor={props.name}>{label}</Label>}
      <Comp {...props} className={inputClassName} />
      {message && <p className="text-sm text-red-600">{message}</p>}
    </div>
  )
}

export { FormField }
