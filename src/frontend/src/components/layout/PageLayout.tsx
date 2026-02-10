import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export default function PageLayout({ children, title, description, className = '' }: PageLayoutProps) {
  return (
    <div className={`page-container ${className}`}>
      {(title || description) && (
        <div className="page-header">
          {title && (
            <h1 className="page-title">
              {title}
            </h1>
          )}
          {description && (
            <p className="page-description">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
