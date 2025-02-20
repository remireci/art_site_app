"use client"

import { useEffect, useState } from "react";
import { useLocation } from "../context/LocationContext";

export default function GetLocation() {
    const { getUserLocation } = useLocation();

    return (
        <div>
            <button onClick={getUserLocation}>My Location</button>
        </div>
    );
}
