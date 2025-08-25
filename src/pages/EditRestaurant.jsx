// src/pages/EditRestaurant.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";

// Import your RTK Query hooks
import {
  useRestaurantDetailsQuery,
  useOwnersQuery,
  useUpdateRestaurantMutation,
} from "../store/apiSlice/apiSlice";

// Import UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingButton from "../components/LoadingButton";
import EditRestaurantDetailsSkeleton from "../components/skeleton/EditRestaurantDetailsSkeleton"; // A simplified skeleton would be needed

// Icons
import { ChevronRight, UploadCloud, CircleX } from "lucide-react";
import { restaurantSchema } from "../validation/RestaurantValidations";

const EditRestaurant = () => {
  const { restaurantID } = useParams();
  const navigate = useNavigate();

  // Fetching data
  const {
    data: restaurantData,
    isLoading: isFetchingDetails,
    refetch,
  } = useRestaurantDetailsQuery(restaurantID);
  const [updateRestaurant, { isLoading: isUpdating }] =
    useUpdateRestaurantMutation();
  const { data: ownersResponse } = useOwnersQuery();

  const [photoPreview, setPhotoPreview] = useState(null);

  const owners = ownersResponse?.allOwner?.map((owner) => ({
    value: String(owner.id),
    label: owner.name,
  }));

  const form = useForm({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: "",
      description: "",
      owner_id: "",
      photo: null,
    },
  });

  // Effect to populate the form once data is fetched
  useEffect(() => {
    refetch();
    if (restaurantData) {
      const restaurant = restaurantData; // The data is the restaurant object itself
      form.reset({
        name: restaurant.name || "",
        description: restaurant.description || "",
        owner_id: `${restaurant.owner.id}`,
        photo: restaurant.photo || null, // Store the initial photo URL
      });
      if (restaurant.photo) {
        setPhotoPreview(restaurant.photo); // Set the initial preview
      }
    }
  }, [restaurantData, form]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPhotoPreview(base64String);
      form.setValue("photo", base64String, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removePhoto = () => {
    form.setValue("photo", null, { shouldValidate: true });
    setPhotoPreview(null);
  };

  const onSubmit = async (data) => {
    try {
      await updateRestaurant({ restaurantID, body: data }).unwrap();
      toast.success("Restaurant updated successfully!", {
        style: {
          background: "white",
          color: "#A1CA46",
          border: "1px solid hsl(var(--border))",
        },
      });
      form.reset();
      setPhotoPreview(null);
      navigate("/restaurants");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update restaurant.", {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <main className="p-4 sm:p-6 md:p-10 bg-gray-50 min-h-screen">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-2xl mx-auto"
          >
            <header className="flex items-center justify-between font-bold mb-5">
              <span className="text-sm text-center sm:text-2xl text-(--primaryFont)">
                Edit Restaurant
              </span>
              <div className="flex items-center text-(--primaryFont) text-sm text-center sm:text-base sm:gap-2 font-medium">
                <NavLink
                  to={"/restaurants"}
                  className={`transition-all text-(--primaryFont) hover:text-(--primary)`}
                >
                  Restaurants List
                </NavLink>
                <ChevronRight size={20} className="text-(--secondaryFont)" />
                <NavLink
                  to={""}
                  className={({ isActive }) =>
                    `transition-all ${
                      isActive ? "text-(--primary)" : "text-(--primaryFont)"
                    }`
                  }
                >
                  Edit Restaurant
                </NavLink>
              </div>
            </header>

            {isFetchingDetails ? (
              <EditRestaurantDetailsSkeleton />
            ) : (
              <>
                <Card className="shadow-sm border">
                  <CardHeader>
                    <CardTitle className="text-lg text-(--primaryFont)">
                      Restaurant Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-(--primaryFont)">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="focus-visible:ring-(--primary) focus:border-0  placeholder-(--secondaryFont) text-(--secondaryFont)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-(--primaryFont)">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="focus-visible:ring-(--primary) focus:border-0  placeholder-(--secondaryFont) text-(--secondaryFont)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="owner_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-(--primaryFont)">
                            Owner
                          </FormLabel>
                          <Select
                            key={field.value}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="text-(--secondaryFont)">
                                <SelectValue placeholder="Select an owner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className=" placeholder-(--secondaryFont) text-(--secondaryFont)">
                              {owners?.map((m) => (
                                <SelectItem key={m.value} value={m.value}>
                                  {m.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-2">
                      <FormLabel className="text-(--primaryFont)">
                        Photo
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="photo"
                        render={() => (
                          <FormItem>
                            <FormControl>
                              {photoPreview ? (
                                <div className="relative group w-full aspect-video">
                                  <img
                                    src={photoPreview}
                                    alt="Preview"
                                    className="w-full h-full rounded-md object-cover border"
                                  />
                                  <div
                                    onClick={removePhoto}
                                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  >
                                    <CircleX className="text-white h-10 w-10" />
                                  </div>
                                </div>
                              ) : (
                                <label
                                  htmlFor="restaurant-photo"
                                  className="group cursor-pointer w-full aspect-video rounded-md border-2 border-dashed flex flex-col justify-center items-center text-center hover:border-(--primary) transition-colors"
                                >
                                  <UploadCloud className="h-10 w-10 text-(--secondaryFont) group-hover:text-(--primary)" />
                                  <p className="mt-2 font-semibold text-(--primaryFont)">
                                    Click to upload
                                  </p>
                                  <p className="text-xs text-(--secondaryFont)">
                                    PNG, JPG, or WEBP (Max 5MB)
                                  </p>
                                  <input
                                    id="restaurant-photo"
                                    type="file"
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={handlePhotoChange}
                                  />
                                </label>
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4 pt-6 border-t-2 border-(--border-color)">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      navigate("/restaurants");
                    }}
                    className="text-(--secondaryFont) cursor-pointer hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    isButton={true}
                    btnClass={"cursor-pointer"}
                    spinColor=""
                    type="submit"
                    loadingText="Saving..."
                    text="Save changes"
                    disabled={isUpdating}
                  />
                </div>
              </>
            )}
          </form>
        </Form>
      </main>
    </>
  );
};

export default EditRestaurant;
