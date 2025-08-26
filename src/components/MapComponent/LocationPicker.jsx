import { useMapEvents } from "react-leaflet";

const LocationPicker = ({ setForm }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setForm((prev) => ({
        ...prev,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      }));
    },
  });
  return null;
};

export default LocationPicker;
