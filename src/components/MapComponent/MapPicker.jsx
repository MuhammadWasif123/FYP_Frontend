import { MapContainer, TileLayer, Marker } from "react-leaflet";
import LocationPicker from "./LocationPicker";

const MapPicker = ({ form, setForm }) => {
  const defaultPosition = [24.8607, 67.0011]; // Islamabad fallback
    
  return (
    <div className="h-72 w-full">
      <MapContainer
        center={form.latitude && form.longitude ? [form.latitude, form.longitude] : defaultPosition}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {form.latitude && form.longitude && (
          <Marker position={[form.latitude, form.longitude]} />
        )}
        <LocationPicker setForm={setForm} />
      </MapContainer>
    </div>
  );
};

export default MapPicker;
