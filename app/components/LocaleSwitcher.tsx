"use client";
import { usePathname, useRouter } from "next/navigation";
import { i18nSlugs } from "../../i18nSlugs";

// For now no translation of url's; TODO later?

export default function LocaleSwitcher() {
    const pathname = usePathname();
    const router = useRouter();


    const switchLocale = (newLocale: "en" | "nl" | "fr") => {
        const pathSegments = pathname.split("/").slice(2);
        const localizedPath = `/${newLocale}/${pathSegments.join("/")}`;
        router.push(localizedPath);
    };


    return (
        <select
            onChange={(e) => switchLocale(e.target.value as "en" | "nl" | "fr")}
            defaultValue={pathname.split("/")[1]}
            className="px-1 py-1 rounded cursor-pointer font-light text-xs"
        >
            <option value="nl">NL</option>
            <option value="fr">FR</option>
            <option value="en">EN</option>
        </select>
    );
}
