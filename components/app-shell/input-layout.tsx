export interface InputLayoutProps {
  children: React.ReactNode;
}

export function InputLayout({ children }: InputLayoutProps) {
  return (
    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
      {children}
    </div>
  );
}
