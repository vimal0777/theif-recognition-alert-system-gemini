import React from 'react';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// FIX: Changed props type to React.PropsWithChildren for better type safety and to resolve downstream type errors.
const Dialog = ({ open, onClose, children }: React.PropsWithChildren<{ open: boolean, onClose: () => void }>) => {
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/80" 
      onClick={onClose}
    >
      <div 
        className="relative bg-card rounded-lg shadow-xl w-full max-w-lg m-4 animate-in fade-in-0 zoom-in-95" 
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 p-6 border-b", className)} {...props} />
);

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = "DialogDescription";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t bg-accent/50", className)} {...props} />
);

export { Dialog, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogContent };
