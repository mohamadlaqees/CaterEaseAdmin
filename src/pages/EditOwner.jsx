// src/pages/EditOwner.jsx

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import { User, Mail, Phone, KeyRound, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LoadingButton from "../components/LoadingButton";
import {
  useEditOwnerMutation,
  useOwnerDetailsQuery,
} from "../store/apiSlice/apiSlice";
import { editOwnerSchema } from "../validation/ownerValidation"; // Import the new schema
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditOwner = () => {
  const { ownerID } = useParams();
  const navigate = useNavigate();

  // Correctly use owner-specific hooks
  const { data: ownerResponse, isFetching } = useOwnerDetailsQuery(ownerID);
  const [editOwner, { isLoading: isUpdating }] = useEditOwnerMutation();
  const response = ownerResponse?.user;
  const form = useForm({
    resolver: zodResolver(editOwnerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "active",
      gender: undefined,
      password: "",
    },
    mode: "onChange",
  });

  // Effect to populate the form with owner data once it's loaded
  useEffect(() => {
    if (response) {
      form.reset({
        name: response.name,
        email: response.email,
        phone: String(response.phone),
        gender: response.gender, // 'm' or 'f'
        password: "", // Keep password field empty by default for security
        status: response.status,
      });
    }
  }, [ownerResponse, form]);

  const onSubmit = async (data) => {
    // Construct the payload, only including password if it's not empty
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      status: data.status,
    };

    if (data.password) {
      payload.password = data.password;
    }

    try {
      const response = await editOwner({ ownerID, payload }).unwrap();
      toast.success(response.message || "Owner updated successfully!", {
        style: {
          background: "white",
          color: "#314E76",
          border: "1px solid hsl(var(--border))",
        },
      });
      navigate(`/owners/${ownerID}`); // Navigate back to details page on success
    } catch (error) {
      toast.error(error?.data?.message || "An update error occurred.", {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  if (isFetching) {
    // You can return a skeleton loader here if you have one for the form
    return <div>Loading form...</div>;
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-(--primaryFont)">
                Edit Owner Information
              </h2>
              <p className="mt-1 text-sm text-(--secondaryFont)">
                Update the profile details for{" "}
                {ownerResponse?.name || "the owner"}.
              </p>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--primaryFont)" />
                        <FormControl>
                          <Input
                            {...field}
                            className="pl-10 focus-visible:ring-(--primary) focus:border-0  placeholder-(--secondaryFont) text-(--secondaryFont)"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Address */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--primaryFont)" />
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            className="pl-10 focus-visible:ring-(--primary) focus:border-0  placeholder-(--secondaryFont) text-(--secondaryFont)"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--primaryFont)" />
                        <FormControl>
                          <Input
                            type="tel"
                            {...field}
                            className="pl-10 focus-visible:ring-(--primary) focus:border-0  placeholder-(--secondaryFont) text-(--secondaryFont)"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-4 pt-2"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="m" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="f" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Female
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--primaryFont)" />
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          key={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="pl-10 focus-visible:ring-(--primary) focus:border-0 placeholder-(--secondaryFont) text-(--secondaryFont)">
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="text-(--secondaryFont)">
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="deleted">Not Active</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* New Password */}
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password (Optional)</FormLabel>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--primaryFont)" />
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Leave blank to keep current password"
                              {...field}
                              className="pl-10 focus-visible:ring-(--primary) focus:border-0  placeholder-(--secondaryFont) text-(--secondaryFont)"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="flex items-center justify-end gap-4 p-6 bg-gray-50/50 border-t border-gray-200 rounded-b-xl">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  navigate("/owners");
                }}
                className="text-(--secondaryFont) hover:text-(--primary) cursor-pointer "
              >
                Cancel
              </Button>
              <LoadingButton
                btnClass={"cursor-pointer"}
                disabled={isUpdating}
                isButton={true}
                loadingText="Saving..."
                text="Save Changes"
                type="submit"
              />
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default EditOwner;
