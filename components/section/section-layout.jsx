export default function SectionLayout({ children, heading }) {
  return (
    <section>
      <h2 className="text-2xl lg:text-3xl text-center pb-5 md:pb-10">
        {heading}
      </h2>
      {children}
    </section>
  );
}
