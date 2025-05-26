export default function SectionLayout({ children, heading }) {
  return (
    <div>
      <h2 className="text-xl text-center md:text-2xl lg:text-3xl pb-5 md:pb-10 tracking-wide">
        {heading}
      </h2>
      {children}
    </div>
  );
}
