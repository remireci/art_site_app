import "leaflet";
import "leaflet-control-geocoder";

declare module "leaflet" {
  namespace Control {
    class Geocoder extends Control {
      constructor(options?: any);
      geocode(query: string, callback: (results: any[]) => void): void;
      reverse(
        location: LatLngExpression,
        scale: number,
        callback: (results: any[]) => void
      ): void;
    }

    namespace Geocoder {
      function nominatim(options?: any): Geocoder;
    }

    function geocoder(options?: any): Geocoder;
  }
}
