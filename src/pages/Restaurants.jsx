import { Link } from "react-router"; // Correct import for react-router
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmptySection from "../components/EmptySection";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { PlusCircle, Pencil, Trash2 } from "lucide-react"; // Import Pencil icon
import ConfirmPopUp from "../components/ConfirmPopUp";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import RestaurantCardGridSkeleton from "../components/skeleton/RestaurantsSkeleton";
import {
  useDeleteRestaurantMutation,
  useRestaurantsQuery,
} from "../store/apiSlice/apiSlice";
import { openConfirmPopUp } from "../store/restaurantSlice";

const Restaurants = () => {
  const dispatch = useDispatch();
  const { data: restaurantsesResponse, isLoading: restaurantsesIsLoading } =
    useRestaurantsQuery();
  console.log(restaurantsesResponse);
  const [deleteRestaurants, { isLoading: deleteRestaurantsIsLoading }] =
    useDeleteRestaurantMutation();
  const [theRestaurantsID, setTheRestaurantsID] = useState(null);

  const { confirmPopUpOpened } = useSelector((state) => state.restaurant);

  const deleteHandler = (restaurantsID) => {
    dispatch(openConfirmPopUp(true));
    setTheRestaurantsID(restaurantsID);
  };
  const cancelPopUpHandler = () => {
    dispatch(openConfirmPopUp(false));
  };

  const deleteTheRestaurants = async () => {
    try {
      const response = await deleteRestaurants(theRestaurantsID);
      dispatch(openConfirmPopUp(false));
      console.log(response);
      toast.success(response.data.message, {
        style: {
          background: "white",
          color: "#314E76",
          border: "1px solid hsl(var(--border))",
        },
      });
    } catch (error) {
      console.log(error);
      toast.error(error.data.error, {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  return (
    <main className="p-4 sm:p-6 md:p-10">
      <Toaster position="top-center" richColors />
      <>
        {confirmPopUpOpened && (
          <ConfirmPopUp
            loading={deleteRestaurantsIsLoading}
            onConfirm={deleteTheRestaurants}
            onCancel={cancelPopUpHandler}
            content={"Are you sure you want to delete this Restaurant?"}
          />
        )}{" "}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-(--primaryFont)">
            Restaurants
          </h1>
          <Button asChild>
            <Link to="/restaurants/add-restaurant">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Restaurant
            </Link>
          </Button>
        </header>
        {/* Corrected conditional rendering order */}
        {restaurantsesIsLoading ? (
          <RestaurantCardGridSkeleton count={8} />
        ) : !restaurantsesResponse || restaurantsesResponse?.length === 0 ? (
          <EmptySection
            title="No Restaurants Found"
            message="You can start by adding a new restaurant."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
            {restaurantsesResponse?.map((restaurants) => (
              <Card
                key={restaurants.id}
                className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col pt-0"
              >
                <CardHeader className="p-0">
                  <img
                    src={
                      restaurants.photo || "https://via.placeholder.com/400x200"
                    }
                    alt={restaurants.name}
                    className="w-full h-40 object-contain"
                  />
                </CardHeader>
                <CardContent className=" flex-grow">
                  <h3 className="text-lg font-bold text-(--primaryFont)">
                    {restaurants.name}
                  </h3>
                  <p className="text-sm text-(--secondaryFont) mt-1">
                    Owner: {restaurants.owner.name}
                  </p>
                  <p className="text-sm text-(--secondaryFont) mt-2">
                    {restaurants.city}
                  </p>
                </CardContent>
                <CardFooter className="p-4 border-t flex flex-col gap-2">
                  {/* Primary Action */}
                  <Button asChild className="w-full">
                    <Link to={`/restaurants/${restaurants.id}`}>
                      View Details
                    </Link>
                  </Button>
                  {/* Secondary Action with distinct style and route */}
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/restaurants/${restaurants.id}/edit-restaurant`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Restaurant
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full hover:border-[#ef4444] hover:text-[#ef4444] hover:bg-transparent cursor-pointer"
                    onClick={() => deleteHandler(restaurants.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Restaurants
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        <Pagination className="mt-10 text-(--secondaryFont) ">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className="hover:bg-primary hover:text-white "
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="hover:bg-primary hover:text-white "
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive
                className="hover:bg-primary hover:text-white "
              >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="hover:bg-primary hover:text-white "
              >
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                className="hover:bg-primary hover:text-white "
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </>
    </main>
  );
};

export default Restaurants;
