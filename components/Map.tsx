"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

type MapProps = {
  position?: google.maps.LatLngLiteral;
  shadowEnd?: google.maps.LatLngLiteral;
  onMapClick: (coords: google.maps.LatLngLiteral) => void;
};

export default function Map({ position, shadowEnd, onMapClick }: MapProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map>();
  const markerRef = useRef<google.maps.Marker>();
  const polyRef = useRef<google.maps.Polyline>();

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      version: "weekly"
    });
    loader.load().then(() => {
      if (!divRef.current) return;
      mapRef.current = new google.maps.Map(divRef.current, {
        center: { lat: 25.033, lng: 121.5654 },
        zoom: 14
      });
      mapRef.current.addListener("click", (e) => {
        onMapClick({ lat: e.latLng!.lat(), lng: e.latLng!.lng() });
      });
    });
  }, [onMapClick]);

  useEffect(() => {
    if (!mapRef.current || !position) return;
    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker({
        map: mapRef.current,
        position
      });
    } else {
      markerRef.current.setPosition(position);
    }
  }, [position]);

  useEffect(() => {
    if (!mapRef.current || !position || !shadowEnd) {
      if (polyRef.current) {
        polyRef.current.setMap(null);
        polyRef.current = undefined;
      }
      return;
    }
    if (!polyRef.current) {
      polyRef.current = new google.maps.Polyline({
        map: mapRef.current,
        path: [position, shadowEnd]
      });
    } else {
      polyRef.current.setPath([position, shadowEnd]);
    }
  }, [position, shadowEnd]);

  return <div ref={divRef} style={{ height: "100%", width: "100%" }} />;
}
