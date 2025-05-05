"use client"

import { useEffect, useState } from "react";
import { useLocation } from "../context/LocationContext";
import { useTranslations } from "next-intl";

export default function GetLocation() {
    const t = useTranslations();
    const { getUserLocation } = useLocation();

    return (
        <div>
            <button onClick={getUserLocation}>{t("homepage.localisation")}</button>
        </div>
    );
}
