export default function SectionLayout({ children, heading }) {
  return (
    <div>
      <h2 className="text-xl text-center md:text-left md:text-2xl lg:text-4xl font-bold pb-5 md:pb-10">
        {heading}
      </h2>
      {children}
    </div>
  );
}
