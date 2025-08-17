"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import SunCalc from "suncalc";
import { DateTime } from "luxon";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

type ShadowInfo = {
  end: google.maps.LatLngLiteral;
  azimuth: number;
  elevation: number;
  length: number;
};

function computeShadow(
  position: google.maps.LatLngLiteral,
  date: Date,
  height: number
): ShadowInfo | null {
  const sun = SunCalc.getPosition(date, position.lat, position.lng);
  const elevation = (sun.altitude * 180) / Math.PI;
  if (elevation <= 0) return null;
  const azimuth = ((sun.azimuth * 180) / Math.PI + 180) % 360;
  const shadowBearing = (azimuth + 180) % 360;
  const length = height / Math.tan(sun.altitude);

  const R = 6378137; // earth radius in meters
  const bearingRad = (shadowBearing * Math.PI) / 180;
  const latRad = (position.lat * Math.PI) / 180;
  const endLat =
    position.lat +
    (length * Math.cos(bearingRad)) / R * (180 / Math.PI);
  const endLng =
    position.lng +
    ((length * Math.sin(bearingRad)) / (R * Math.cos(latRad))) *
      (180 / Math.PI);

  return {
    end: { lat: endLat, lng: endLng },
    azimuth,
    elevation,
    length
  };
}

export default function Home() {
  const [marker, setMarker] = useState<google.maps.LatLngLiteral>();
  const [date, setDate] = useState(
    DateTime.now().toISO({ suppressSeconds: true, includeOffset: false })
  );
  const [height, setHeight] = useState(1);
  const [shadow, setShadow] = useState<ShadowInfo | null>(null);

  const handleMapClick = useCallback((p: google.maps.LatLngLiteral) => {
    setMarker(p);
  }, []);

  useEffect(() => {
    if (!marker) return;
    const d = DateTime.fromISO(date).toJSDate();
    setShadow(computeShadow(marker, d, height));
  }, [marker, date, height]);

  return (
    <div style={{ height: "100vh" }}>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1,
          background: "white",
          padding: "8px",
          borderRadius: "4px",
          minWidth: "220px"
        }}
      >
        <div>
          <label>
            日期時間:
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            高度(公尺):
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value))}
            />
          </label>
        </div>
        {shadow ? (
          <div>
            <div>方位角: {shadow.azimuth.toFixed(2)}°</div>
            <div>高度角: {shadow.elevation.toFixed(2)}°</div>
            <div>影長: {shadow.length.toFixed(2)}m</div>
          </div>
        ) : (
          <div>無日照</div>
        )}
      </div>
      <Map
        position={marker}
        onMapClick={handleMapClick}
        shadowEnd={shadow?.end}
      />
    </div>
  );
}
