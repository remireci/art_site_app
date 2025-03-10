// "use client";
// import { usePathname, useRouter } from "next/navigation";
// import { i18nSlugs } from "../../i18nSlugs";

// export default function LocaleSwitcher() {
//     const pathname = usePathname();
//     const router = useRouter();

//     const switchLocale = (newLocale: string) => {
//         const pathSegments = pathname.split("/").slice(2); // Remove current locale
//         const localizedPath = `/${newLocale}/${pathSegments.map(seg => i18nSlugs[newLocale][seg] || seg).join("/")}`;
//         router.push(localizedPath);
//     };

//     return (
//         <div>
//             <button onClick={() => switchLocale("nl")}>NL</button>
//             <button onClick={() => switchLocale("fr")}>FR</button>
//             <button onClick={() => switchLocale("en")}>EN</button>
//         </div>
//     );
// }
