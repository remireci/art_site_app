'use client'
import React, { useState, useEffect, useCallback } from 'react';
import L, { LatLngTuple, LeafletEvent, LeafletMouseEvent } from 'leaflet';
import MarkerIcon from '../../../node_modules/leaflet/dist/images/marker-icon.png'
import MarkerShadow from '../../../node_modules/leaflet/dist/images/marker-shadow.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faRoute } from '@fortawesome/free-solid-svg-icons';
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from 'react-leaflet'
import { useLocation } from '@/context/LocationContext';
import GetLocation from '../GetLocation';
import debounce from '../../utils/debounce';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import ExhibitionCarousel from './ExhibitionCarousel/ExhibitionCarousel';
import "../../styles/globals.css";


interface MapProps {
    searchQuery: string;
    locations: Location[];
    groupedExhibitions: Array<{
        key: string;
        domain: string;
        location: string | null;
        exhibitions: Exhibition[];
    }>;
}

type Exhibition = {
    _id: string;
    title: string;
    date_end: string;
    location: string;
    url: string;
    exh_url?: string;
    artists?: string;
    date_end_st: string;
    image_reference: string[];
    exhibition_url: string;
}

type LocationMarker = {
    lat: number;
    lon: number;
    address: string;
}

interface Location {
    latitude: number;
    longitude: number;
    domain: string;
    name: string;
    domain_slug: string;
}

type LocationWithMarker = LocationMarker & {
    lat: Location['latitude'];
    lon: Location['longitude'];
    address: string;
    domain: Location['domain'];
    name: Location['name'];
    domain_slug: Location['domain_slug'];
};


const MapTest = React.memo(({ searchQuery, locations, groupedExhibitions }: MapProps) => {

    const possibleStartLocations: LatLngTuple[] = [
        [50.8503, 4.3517], // Brussels, Belgium
        [52.3676, 4.9041], // Amsterdam, Netherlands
        [51.2194, 4.4025], // Antwerpen, Belgium
        [51.9225, 4.4792], // Rotterdam, Netherlands
        [51.0446, 3.7217], // Gent, Belgium
        [50.6326, 5.5797], // Liège, Belgium
        [51.4416, 5.4697], // Eindhoven, Netherlands    
        [51.2277, 6.7735], // Düsseldorf, Germany
        [48.8566, 2.3522], // Paris, France
        [49.6117, 6.1319], // Luxembourg City, Luxembourg       
    ];

    // const bozarGroup = Object.values(groupedExhibitions).find(
    //     group => group.key === "bozar.be"
    // );


    // console.log("the exhibitions", groupedExhibitions);

    const getRandomLocation = (): LatLngTuple => {
        return possibleStartLocations[Math.floor(Math.random() * possibleStartLocations.length)];
    };

    const { userLocation } = useLocation();
    const [coord, setCoord] = useState<LatLngTuple>(getRandomLocation());
    const [locationMarkers, setLocationMarkers] = useState<LocationMarker[]>([]);
    const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
    const [filteredLocations, setFilteredLocations] = useState<LocationWithMarker[]>([]);
    const [shouldCenter, setShouldCenter] = useState(false);
    const [isMapReady, setIsMapReady] = useState(false);


    useEffect(() => {
        if (!searchQuery) {
            setCoord(getRandomLocation());
            setIsMapReady(true);
        }
    }, [searchQuery]);


    // console.log("Map re-rendering", userLocation);

    // const debouncedFetchLocations = useCallback(debounce(async (bounds) => {
    //     const newLocations = await fetchLocationsFromDatabase(bounds);
    //     setFilteredLocations(newLocations);
    // }, 500), [fetchLocationsFromDatabase]);

    const TrackMapBounds = () => {
        const map = useMap();

        useEffect(() => {
            if (!map) return;

            let timeoutId: NodeJS.Timeout | null = null;

            const updateBounds = () => {
                if (timeoutId) clearTimeout(timeoutId);

                timeoutId = setTimeout(() => {
                    const newBounds = map.getBounds();
                    setMapBounds((prevBounds) => {
                        if (!prevBounds || !prevBounds.equals(newBounds)) {
                            return newBounds;
                        }
                        return prevBounds;
                    });
                }, 200);
            };

            // Detect if the user is on a mobile device
            const isMobile = "ontouchstart" in window;

            if (isMobile) {
                // Close popups when clicking elsewhere
                const closePopups = () => {
                    map.eachLayer((layer) => {
                        if (layer instanceof L.Marker) {
                            layer.closePopup();
                        }
                    });
                };
                map.on("click", closePopups);
            }

            //Set initial bounds once the map is ready
            updateBounds();
            map.on('moveend', updateBounds);
            map.on('zoomend', updateBounds);

            return () => {
                if (timeoutId) clearTimeout(timeoutId);
                map.off('moveend', updateBounds);
                map.off('zoomend', updateBounds);
            };
        }, [map]);

        return null; // This component doesn't render UI but tracks the map bounds
    };

    useEffect(() => {
        if (!mapBounds || !locations) return; // Ensure mapBounds and locations are defined

        const excludedLocations: LocationWithMarker[] = [];

        locations.forEach(location => {
            const lat = Number(location.latitude);
            const lon = Number(location.longitude);
            const isInsideBounds = mapBounds.contains(L.latLng(lat, lon));

            if (!isInsideBounds) {
                excludedLocations.push({
                    lat,
                    lon,
                    address: `${location.name}`, // Combine domain and name as the address
                    domain: location.domain,
                    name: location.name,
                    domain_slug: location.domain_slug,
                });
            }
        });

        const newFilteredLocations: LocationWithMarker[] = locations
            .filter(location => {
                // Ensure latitude and longitude are valid before checking bounds
                const lat = Number(location.latitude);
                const lon = Number(location.longitude);
                return !isNaN(lat) && !isNaN(lon) && mapBounds.contains(L.latLng(lat, lon));
            })
            .map(location => ({
                lat: location.latitude,
                lon: location.longitude,
                address: `${location.name}`, // Combine domain and name as the address
                domain: location.domain,
                name: location.name,
                domain_slug: location.domain_slug,
            }));


        // Update state only if locations actually change
        setFilteredLocations(prevLocations => {
            if (JSON.stringify(prevLocations) !== JSON.stringify(newFilteredLocations)) {
                return newFilteredLocations;
            }
            return prevLocations;
        });
    }, [mapBounds, locations]);


    useEffect(() => {
        if (userLocation) {
            setCoord(userLocation);
            setShouldCenter(true);
            setIsMapReady(true);
        }
    }, [userLocation]);


    const UpdateMapCenter = () => {
        const map = useMap();

        useEffect(() => {
            if (shouldCenter && coord) {
                const newCenter = L.latLng(coord[0], coord[1]);
                setShouldCenter(false); // Disable further auto-centering
                map.setView(newCenter, map.getZoom());

            }
        }, [map, coord, shouldCenter]);

        return null;
    };


    useEffect(() => {

        if (!searchQuery) return;

        const fetchLocation = async () => {
            try {
                const geocoder = (L.Control as any).Geocoder.nominatim();
                const results = await geocoder.geocode(searchQuery);
                if (results && results.length > 0) {
                    const { center } = results[0];
                    setCoord([center.lat, center.lng]);
                    setShouldCenter(true);
                    setIsMapReady(true);
                }
            } catch (error) {
                console.error("Geocoder error:", error);
            }
        };

        fetchLocation();
    }, [searchQuery]);


    return (
        <div>
            {isMapReady && (<MapContainer
                className="h-[60vh] w-[80vw] md:w-[60vw] lg:w-[65vw] xl:w-[38vw]"
                center={coord}
                zoom={13}
                scrollWheelZoom={true}
                zoomControl={true}      // Show zoom controls
                doubleClickZoom={true}  // Enable double-click zoom
                touchZoom={true}        // Enable touch zoom
                dragging={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <UpdateMapCenter />
                <TrackMapBounds />
                {userLocation && (
                    <Marker
                        position={userLocation}
                        icon={new L.Icon({
                            iconUrl: "/Neuter_3.png", // Change this to a custom marker icon
                            iconSize: [20, 30], // Adjust size
                            iconAnchor: [10, 30],
                            popupAnchor: [0, -30],
                        })}
                    >
                        <Popup>You are here</Popup>
                    </Marker>
                )}
                <>
                    {filteredLocations.map((location) => {
                        // Find matching exhibition groups
                        const locationGroups = Object.values(groupedExhibitions).filter(group => {
                            // For multi-location institutions - more precise check
                            if (group.key.startsWith(`${location.domain}_`)) {
                                return group.location === location.name;
                            }
                            // For single-location institutions
                            return group.domain === location.domain && !group.key.includes('_');
                        });


                        // Flatten all exhibitions from matching groups
                        const exhibitionsInLocation = locationGroups.flatMap(group => group.exhibitions);


                        if (exhibitionsInLocation.length === 0) {
                            return null;
                        }
                        // // Filter exhibitions that match the location's domain
                        // const exhibitionsInLocation = exhibitions.filter(exhibition => {
                        //     if (!exhibition.url || !location.domain) return false; // Ensure both exist                            
                        //     // Normalize URLs: Remove "http://", "https://", and "www."
                        //     const normalizedExhibitionUrl = exhibition.url
                        //         .toLowerCase()
                        //         .replace(/^(https?:\/\/)?(www\.)?/, "") // Remove protocol & "www."
                        //         .replace(/\/$/, ""); // Remove trailing slash

                        //     const normalizedDomain = location.domain.toLowerCase();

                        //     return normalizedExhibitionUrl.includes(normalizedDomain);
                        // });
                        // // Check if there are any exhibitions for the current location
                        // if (exhibitionsInLocation.length === 0) {
                        //     return null;
                        // }

                        return (
                            <Marker
                                key={`${location.domain}_${location.name || 'main'}`}
                                position={[location.lat, location.lon]}
                                icon={
                                    new L.Icon({
                                        iconUrl: "/Thumbtack_4.png",
                                        // iconRetinaUrl: MarkerIcon.src,
                                        iconSize: [25, 41],
                                        iconAnchor: [12.5, 41],
                                        popupAnchor: [0, -41],
                                        shadowUrl: MarkerShadow.src,
                                        shadowSize: [41, 41],
                                    })
                                }
                                eventHandlers={{
                                    mouseover: (e) => {
                                        e.target.openPopup(); // Open popup on hover
                                    },
                                    mouseout: (e) => {
                                        // Delay closing the popup to allow hovering over it
                                        setTimeout(() => {
                                            const popup = e.target.getPopup();
                                            if (!popup || !popup.getElement()?.matches(':hover')) {
                                                e.target.closePopup(); // Close popup only if not hovering over it
                                            }
                                        }, 500); // Adjust delay as needed
                                    }
                                }}
                            >
                                {/* <Tooltip>{location.address}</Tooltip> */}
                                <Popup
                                    autoPan={false} // Disable auto-pan
                                    keepInView={false} // Prevent map from adjusting
                                    closeOnClick={true} // Prevent closing on map click
                                    closeButton={false}
                                    offset={L.point(0, 10)}
                                    eventHandlers={{
                                        mouseover: (e) => {
                                            // Keep the popup open when hovering over it
                                            const marker = e.target._source;
                                            // marker._popup._closeButton.style.display = 'none'; // Optional: Hide close button
                                        },
                                        mouseout: (e) => {
                                            // Close the popup when the cursor leaves both the marker and the popup
                                            const marker = e.target._source;
                                            setTimeout(() => {
                                                if (!marker._popup.getElement()?.matches(':hover')) {
                                                    marker.closePopup();
                                                }
                                            }, 500); // Adjust delay as needed
                                        }
                                    }}
                                >
                                    <div className='bg-slate-200 text-slate-600 rounded-lg p-2 text-center text-sm'>
                                        <ExhibitionCarousel
                                            exhibitionsInLocation={exhibitionsInLocation}
                                            slug={location.domain_slug}
                                        />
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    })}
                </>
            </MapContainer>)}

        </div>
    );
});

// Assign a display name
MapTest.displayName = 'MapTest';

export default MapTest;