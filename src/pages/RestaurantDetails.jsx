import { useParams, NavLink } from "react-router";
import { useRestaurantDetailsQuery } from "../store/apiSlice/apiSlice";

// Import UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Icons
import { ChevronRight, User, Phone, Home, Mail, Calendar } from "lucide-react";
import RestaurantDetailsSkeleton from "../components/skeleton/RestaurantDetailsSkeleton";
import { useEffect } from "react";

// A small helper component for displaying info items
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3">
    {/* Icon uses secondary font color */}
    <div className="flex-shrink-0 text-(--secondaryFont) pt-1">{icon}</div>
    <div>
      {/* Label uses secondary font color */}
      <p className="text-sm font-medium text-(--secondaryFont)">{label}</p>
      {/* Value uses primary font color */}
      <p className="text-base font-semibold text-(--primaryFont)">
        {value || "Not available"}
      </p>
    </div>
  </div>
);

const RestaurantDetails = () => {
  const { restaurantID } = useParams();

  // --- KEY CHANGE 1 ---
  // Rename `data` to `restaurant` directly.
  // This makes `restaurant` the actual response object.
  const {
    data: restaurant, // <-- The main fix is here!
    isLoading,
    refetch,
  } = useRestaurantDetailsQuery(restaurantID);

  useEffect(() => {
    refetch();
  }, []);

  // --- This line is no longer needed ---
  // const { restaurant } = data || {}; // <-- REMOVE THIS

  // Helper function to format the date (no changes needed here)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="p-4 sm:p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* --- Header --- */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-sm sm:text-3xl font-bold text-(--primaryFont)">
            Restaurant Details
          </h1>
          <div className="flex text-(--primaryFont) items-center gap-2 text-sm sm:text-base font-medium">
            <NavLink
              to="/restaurants"
              className="text-(--primaryFont) hover:text-(--primary) transition-all"
            >
              Restaurants
            </NavLink>
            <ChevronRight size={20} />
            <span className="text-(--primary)"> {restaurant?.name}</span>
          </div>
        </header>

        {isLoading ? (
          <RestaurantDetailsSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* --- Main Information Card --- */}
                <Card className="shadow-sm border">
                  <CardHeader>
                    <CardTitle className="text-lg text-(--primaryFont)">
                      Restaurant Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* InfoItem now uses the correct colors internally */}
                    <InfoItem
                      icon={<Home size={20} />}
                      label="Description"
                      value={restaurant?.description}
                    />
                    <InfoItem
                      icon={<Calendar size={20} />}
                      label="Created On"
                      value={formatDate(restaurant?.created_at)}
                    />
                  </CardContent>
                </Card>

                {/* --- Owner Details Card --- */}
                <Card className="shadow-sm border">
                  <CardHeader>
                    <CardTitle className="text-lg text-(--primaryFont)">
                      Owner Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* InfoItem now uses the correct colors internally */}
                    <InfoItem
                      icon={<User size={20} />}
                      label="Name"
                      value={restaurant?.owner?.name}
                    />
                    <InfoItem
                      icon={<Phone size={20} />}
                      label="Phone"
                      value={restaurant?.owner?.phone}
                    />
                    <InfoItem
                      icon={<Mail size={20} />}
                      label="Email"
                      value={restaurant?.owner?.email}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-1 space-y-8">
                {/* --- Restaurant Photo Card --- */}
                <Card className="shadow-sm border">
                  <CardHeader>
                    <CardTitle className="text-lg text-(--primaryFont)">
                      Restaurant Photo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {restaurant?.photo ? (
                      <img
                        src={restaurant.photo}
                        alt={restaurant.name}
                        className="w-full h-auto rounded-md object-cover border"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
                        <p className="text-(--secondaryFont)">
                          No photo available
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default RestaurantDetails;
