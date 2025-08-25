import { Star } from "lucide-react";

const renderStars = (rating, size = 24) => {
  const clampedRating = Math.max(0, Math.min(5, rating));

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => {
        const fillColor = i < clampedRating ? "#facc15" : "#e0e0e0"; // Using a slightly lighter gray for better aesthetics

        return (
          <Star
            key={i}
            size={size}
            fill={fillColor}
            strokeWidth={0} // Using strokeWidth={0} is often clearer than stroke="none" for SVGs
          />
        );
      })}
    </div>
  );
};

export default renderStars;
