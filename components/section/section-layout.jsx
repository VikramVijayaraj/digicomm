export default function SectionLayout({ children, heading }) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl lg:text-4xl text-center pb-5 md:pb-10 font-semibold">
        {heading}
      </h2>
      {children}
    </div>
  );
}
