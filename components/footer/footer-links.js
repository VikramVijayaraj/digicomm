export default function FooterLinks({ links }) {
  return (
    <>
      {links.map((link, index) => (
        <p className="cursor-pointer py-1 hover:underline" key={index}>{link}</p>
      ))}
    </>
  );
}
