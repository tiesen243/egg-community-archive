import { siteConfig } from '@/lib/site'

const Footer: React.FC = () => (
  <footer className="border-t bg-background py-4">
    <div className="container flex flex-col items-center justify-between gap-2 md:flex-row">
      <p>
        &copy; Copyright {new Date().getFullYear()} {siteConfig.applicationName}. All rights reserved.
      </p>

      <p>
        Created by{' '}
        <a href={siteConfig.authors.url} target="_blank" rel="noopener noreferrer">
          {siteConfig.authors.name}
        </a>
      </p>
    </div>
  </footer>
)

export default Footer
