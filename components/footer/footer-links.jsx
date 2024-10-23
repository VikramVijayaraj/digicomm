import Link from "next/link";

export default function FooterLinks({ links }) {
  return (
    <ul className="w-fit m-auto">
      {links.map((link) => (
        <Link href={link.link} key={link.name}>
          <li className="cursor-pointer py-1 hover:underline">{link.name}</li>
        </Link>
      ))}
    </ul>
  );
}
