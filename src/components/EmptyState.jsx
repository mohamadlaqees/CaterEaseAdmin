// src/components/EmptyState.jsx
import { PlusCircle } from "lucide-react";

// The component accepts props to make it flexible for different contexts.
const EmptyState = ({
  icon: Icon = PlusCircle, // Default icon if none is provided
  title,
  description,
}) => {
  return (
    <div className="flex flex-col h-full items-center justify-center text-center p-10 m-auto bg-slate-50/50 border border-dashed border-slate-300 rounded-xl">
      <Icon className="h-16 w-16 text-slate-400 mb-4" strokeWidth={1.5} />

      <h2 className="text-xl font-semibold text-slate-800 mb-2">{title}</h2>

      <p className="max-w-md text-slate-500 mb-6">{description}</p>
    </div>
  );
};

export default EmptyState;
