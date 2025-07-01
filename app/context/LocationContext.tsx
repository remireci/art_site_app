"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { LatLngTuple } from "leaflet";

// Define the shape of the location state
type Location = { latitude: number | null; longitude: number | null };

// Define the shape of the context
type LocationContextType = {
    userLocation: LatLngTuple | null;
    setUserLocation: (userLocation: LatLngTuple) => void;
    getUserLocation: () => void;
};

// Create context with a default value
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Provider component
export function LocationProvider({ children }: { children: ReactNode }) {
    const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);

    const getUserLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error("Error obtaining location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser");
        }
    };

    return (
        <LocationContext.Provider value={{ userLocation, setUserLocation, getUserLocation }} >
            {children}
        </LocationContext.Provider>
    );
}

// Custom hook to use the location context
export function useLocation() {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error("useLocation must be used within a LocationProvider");
    }
    return context;
}
