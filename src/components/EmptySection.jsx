// src/components/EmptyState.jsx
import { Inbox } from "lucide-react";

const EmptySection = ({ title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <Inbox className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
      <p className="text-gray-500 mt-2">{message}</p>
    </div>
  );
};

export default EmptySection;
