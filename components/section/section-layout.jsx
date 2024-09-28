export default function SectionLayout({ children, heading }) {
  return (
    <div className="py-10">
      <h2 className="text-4xl font-bold pb-10">{heading}</h2>
      {children}
    </div>
  );
}
