import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

const MD: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => (
  <ReactMarkdown
    components={{
      a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
    }}
    className={cn('prose prose-zinc dark:prose-invert', className)}
  >
    {text}
  </ReactMarkdown>
)

export default MD
