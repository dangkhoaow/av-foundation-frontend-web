/**
 * Collection Layout with Parallel Routes
 * Supports modal overlay for artwork details while keeping collection page mounted
 */

export default function CollectionLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}



