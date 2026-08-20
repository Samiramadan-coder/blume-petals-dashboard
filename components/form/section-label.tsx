export default function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="text-xs font-bold uppercase text-muted-foreground">
      {children}
    </p>
  );
}
