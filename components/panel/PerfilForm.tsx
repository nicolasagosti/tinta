"use client";

import UbicacionInput from "./UbicacionInput";

export type DatosPerfil = {
  nombre: string;
  ciudad: string;
  barrio: string;
  contacto_instagram: string;
  contacto_whatsapp: string;
  contacto_email: string;
  contacto_web: string;
};

const campoClase =
  "w-full rounded-lg border border-tinta-700 bg-tinta-900 px-3 py-2 text-sm text-tinta-100 placeholder:text-tinta-500 focus:border-acento focus:outline-none";

export default function PerfilForm({
  form,
  onChange,
}: {
  form: DatosPerfil;
  onChange: (campo: keyof DatosPerfil, valor: string) => void;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-tinta-800 bg-tinta-900 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-tinta-300">Nombre</span>
          <input
            className={campoClase}
            value={form.nombre}
            onChange={(e) => onChange("nombre", e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-tinta-300">Ubicación</span>
          <UbicacionInput value={form.ciudad} onChange={(valor) => onChange("ciudad", valor)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-tinta-300">Barrio</span>
          <input
            className={campoClase}
            placeholder="Palermo, Nueva Córdoba…"
            value={form.barrio}
            onChange={(e) => onChange("barrio", e.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-tinta-300">Instagram</span>
          <input
            className={campoClase}
            placeholder="@usuario"
            value={form.contacto_instagram}
            onChange={(e) => onChange("contacto_instagram", e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-tinta-300">WhatsApp</span>
          <input
            className={campoClase}
            placeholder="+54 9 11 1234-5678"
            value={form.contacto_whatsapp}
            onChange={(e) => onChange("contacto_whatsapp", e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-tinta-300">Email</span>
          <input
            type="email"
            className={campoClase}
            value={form.contacto_email}
            onChange={(e) => onChange("contacto_email", e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-tinta-300">Sitio web</span>
          <input
            className={campoClase}
            placeholder="https://…"
            value={form.contacto_web}
            onChange={(e) => onChange("contacto_web", e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}
