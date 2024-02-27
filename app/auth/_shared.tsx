import { Button } from '@/components/ui/button'
import { CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface HeaderProps {
  title: string
  description: string
}

export const FormHeader: React.FC<HeaderProps> = ({ title, description }) => (
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
)

interface FooterProps {
  btnText: string
  isSubmitting?: boolean
}
export const FormFooter: React.FC<FooterProps> = ({ btnText, isSubmitting = false }) => (
  <CardFooter className="items-center justify-end gap-4">
    <Button type="button" variant="secondary" disabled={isSubmitting}>
      Cancel
    </Button>
    <Button type="submit" isLoading={isSubmitting}>
      {btnText}
    </Button>
  </CardFooter>
)
