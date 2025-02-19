"use client"

import { useEffect, useState } from "react";
import { useLocation } from "../context/LocationContext";

export default function GetLocation() {
    const { getUserLocation } = useLocation();
    // const { location, setLocation } = useLocation();

    // const getUserLocation = () => {
    //     if ("geolocation" in navigator) {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 setLocation({
    //                     latitude: position.coords.latitude,
    //                     longitude: position.coords.longitude,
    //                 });
    //             },
    //             (error) => {
    //                 console.error("Error obtaining location:", error);
    //             }
    //         );
    //     } else {
    //         console.error("Geolocation is not supported by this browser");
    //     }
    // };

    // useEffect(() => {
    //     console.log("from get location", location);
    // }, [location])

    return (
        <div>
            <button onClick={getUserLocation}>My Location</button>
            {/* {location.latitude && location.longitude && (
                <p>
                    Latitude: {location.latitude}, Longitude: {location.longitude}
                </p>
            )} */}
        </div>
    );
}
