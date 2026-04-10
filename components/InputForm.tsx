import { useState } from "react";

interface VehicleFormProps {
  onSubmit: (data: any) => void;
}

export default function VehicleForm({ onSubmit }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    condition: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Vehicle Analysis</h2>

      <div className="space-y-2">
        <label className="block font-medium text-gray-700">Make</label>
        <input
          type="text"
          name="make"
          value={formData.make}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium text-gray-700">Model</label>
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium text-gray-700">Year</label>
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium text-gray-700">Condition</label>
        <select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        >
          <option value="">Select condition</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-2 rounded-lg hover:scale-105 transform transition"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Get Suggested Price"}
      </button>
    </form>
  );
}
