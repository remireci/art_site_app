"use client"

import { useEffect, useState } from "react";

export default function GetLocation() {
    const [location, setLocation] = useState({ latitude: null, longitude: null });

    const getUserLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error obtaining location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser");
        }
    };

    useEffect(() => {
        console.log(location)
    }, [location])

    return (
        <div>
            <button onClick={getUserLocation}>My Location</button>
            {location.latitude && location.longitude && (
                <p>
                    Latitude: {location.latitude}, Longitude: {location.longitude}
                </p>
            )}
        </div>
    );
}
