import Link from "next/link";

export default function FooterLinks({ links }) {
  return (
    <ul>
      {links.map((link) => (
        <li className="cursor-pointer py-1 hover:underline" key={link.name}>
          <Link href={link.link}>{link.name}</Link>
        </li>
      ))}
    </ul>
  );
}
