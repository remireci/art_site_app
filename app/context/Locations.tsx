// app/contexts/location.tsx
"use client"; // Required for context (client-side)

import { createContext, useContext } from "react";

interface LocationData {
    domain: string;
    // Add other fields as needed
}

const LocationContext = createContext<LocationData | null>(null);

export function useLocation() {
    const context = useContext(LocationContext);
    if (!context) throw new Error("useLocation must be used within a LocationProvider");
    return context;
}

export function LocationProvider({
    children,
    data,
}: {
    children: React.ReactNode;
    data: LocationData;
}) {
    return (
        <LocationContext.Provider value={data}>
            {children}
        </LocationContext.Provider>
    );
}