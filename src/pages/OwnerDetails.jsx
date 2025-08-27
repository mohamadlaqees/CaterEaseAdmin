import {
  ChevronRight,
  EllipsisVertical,
  Mail,
  Phone,
  User,
  Calendar,
  Trash2,
  Edit,
  ShieldAlert,
  ShieldCheck,
  GitBranch, // Icon for the branch
  MapPin, // Icon for the city
  ArrowRight, // Icon for the button
} from "lucide-react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "sonner";

import EditOwnerSkeleton from "../components/skeleton/EditOwnerSkeleton";
import {
  useDeleteOwnerMutation,
  useOwnerDetailsQuery,
} from "../store/apiSlice/apiSlice";
import { openConfirmPopUp } from "../store/ownerSlice";
import ConfirmPopUp from "../components/ConfirmPopUp";
import { OwnerDetailsSkeleton } from "../components/skeleton/OwnerDetailsSkeleton";
import { Button } from "@/components/ui/button";

// Helper function to format dates for better readability
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper component for detail items to reduce repetition
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 text-sm">
    <div className="flex-shrink-0 text-(--secondaryFont)">{icon}</div>
    <div className="flex-grow">
      <p className="text-(--secondaryFont)">{label}</p>
      {typeof value === "object" ? (
        value.map((branch) => (
          <p className="font-semibold text-(--primaryFont)">
            {`${branch.description}` || "Not Provided"}
            {value.length > 1 ? "," : ""}
          </p>
        ))
      ) : (
        <p className="font-semibold text-(--primaryFont)">
          {value || "Not Provided"}
        </p>
      )}
    </div>
  </div>
);

const OwnerDetails = () => {
  const { ownerID } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const [isMenuOpen, setMenuOpen] = useState(false);

  const { confirmPopUpOpened } = useSelector((state) => state.owner);
  const { data: responseData, isLoading: ownerDetailsIsLoading } =
    useOwnerDetailsQuery(ownerID);
  const [deleteOwner, { isLoading: deleteOwnerIsLoading }] =
    useDeleteOwnerMutation();

  const isEditPage = location.pathname.endsWith("edit-owner");

  // --- Event Handlers ---
  const handleDeleteOwner = async () => {
    try {
      await deleteOwner(ownerID).unwrap();
      toast.success("Owner has been deleted successfully.", {
        style: {
          background: "white",
          color: "#314E76",
          border: "1px solid hsl(var(--border))",
        },
      });
      dispatch(openConfirmPopUp(false));
      navigate("/owners");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete owner.", {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  // --- Click outside handler for the dropdown menu ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Data Processing ---
  const owner = responseData?.user || {};
  const restaurant = responseData?.restaurant || {};
  const { name, email, phone, status, role, created_at, email_verified_at } =
    owner;

  const restaurantImage =
    restaurant.photo?.replace(/\\\//g, "/") || "/default-branch.png";

  // --- UI Rendering ---

  if (ownerDetailsIsLoading) {
    return isEditPage ? <EditOwnerSkeleton /> : <OwnerDetailsSkeleton />;
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      {confirmPopUpOpened && (
        <ConfirmPopUp
          loading={deleteOwnerIsLoading}
          onConfirm={handleDeleteOwner}
          onCancel={() => dispatch(openConfirmPopUp(false))}
          title="Confirm Deletion"
          content={`Are you sure you want to delete the owner "${name}"? This action cannot be undone.`}
        />
      )}

      <main className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 ">
        <div className="max-w-7xl mx-auto">
          {/* --- Header & Breadcrumbs --- */}
          <header className="flex items-center sm:items-center justify-between mb-20">
            <h1 className="text-2xl sm:text-3xl font-bold text-(--primaryFont)">
              {isEditPage ? "Edit Owner" : "Owner Details"}
            </h1>
            <div className="flex text-(--primaryFont) items-center gap-2 text-sm sm:text-base font-medium">
              <NavLink
                to="/owners"
                className="hover:text-(--primary) transition-all"
              >
                Owners
              </NavLink>
              <ChevronRight size={20} />
              <span className="font-medium text-(--primary)">
                {isEditPage ? "Edit" : name}
              </span>
            </div>
          </header>

          {isEditPage ? (
            <Outlet />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* --- Left Column: Profile Card (Unchanged) --- */}
              <div className="lg:col-span-1 space-y-8">
                <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
                  <div className="p-6 flex flex-col items-center text-center relative">
                    <img
                      src={"/person.png"}
                      alt={`${name}'s profile`}
                      className="w-28 h-28 rounded-full border-4 border-white shadow-lg -mt-16"
                    />
                    <h2 className="mt-4 text-2xl font-bold text-(--primaryFont)">
                      {name}
                    </h2>
                    <p className="text-sm text-(--secondaryFont)">
                      {role?.name}
                    </p>
                    <div
                      className={`mt-4 px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                        status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {status}
                    </div>
                    <div className="absolute top-4 right-4" ref={menuRef}>
                      <button
                        onClick={() => setMenuOpen(!isMenuOpen)}
                        aria-label="Options menu"
                        className="p-2 cursor-pointer rounded-full text-(--secondaryFont) hover:bg-gray-100 hover:text-(--primaryFont) focus:outline-none"
                      >
                        <EllipsisVertical className="h-6 w-6" />
                      </button>
                      <div
                        className={`absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border-2 border-(--border-color) transition-all duration-200 ease-in-out ${
                          isMenuOpen
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-2 pointer-events-none"
                        }`}
                      >
                        <div className=" text-(--primaryFont)">
                          <Link
                            to="edit-owner"
                            className="block px-4 text-left py-2 text-sm hover:bg-gray-100"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => dispatch(openConfirmPopUp(true))}
                            className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 p-6">
                    <h3 className="font-semibold text-(--primaryFont) mb-4">
                      Account Details
                    </h3>
                    <div className="space-y-4">
                      <DetailItem
                        icon={<Calendar size={20} />}
                        label="Date Joined"
                        value={formatDate(created_at)}
                      />
                      <DetailItem
                        icon={
                          email_verified_at ? (
                            <ShieldCheck size={20} className="text-green-600" />
                          ) : (
                            <ShieldAlert
                              size={20}
                              className="text-yellow-600"
                            />
                          )
                        }
                        label="Email Verification"
                        value={
                          email_verified_at
                            ? `Verified on ${formatDate(email_verified_at)}`
                            : "Pending Verification"
                        }
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* --- Right Column: Information (with new card added) --- */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact Info Card (Unchanged) */}
                <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-(--primaryFont) mb-4">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailItem
                      icon={<User size={20} />}
                      label="Full Name"
                      value={name}
                    />
                    <DetailItem
                      icon={<Mail size={20} />}
                      label="Email Address"
                      value={email}
                    />
                    <DetailItem
                      icon={<Phone size={20} />}
                      label="Phone Number"
                      value={phone}
                    />
                  </div>
                </section>

                {/* ✅ NEW: Managed Branch Card */}
                <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-(--primaryFont) mb-4 flex items-center">
                      <GitBranch className="mr-2" size={20} />
                      Managed Restaurant
                    </h3>
                  </div>
                  {restaurant.id ? (
                    <>
                      <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-6 items-start ">
                        <img
                          src={restaurantImage}
                          alt={restaurant.description}
                          className="w-full sm:w-32 h-32 rounded-full object-cover"
                        />
                        <div className="space-y-4 flex-grow">
                          <DetailItem
                            icon={<GitBranch size={16} />}
                            label="Restaurant Name"
                            value={restaurant.name}
                          />
                          <DetailItem
                            icon={<MapPin size={16} />}
                            label="City"
                            value={restaurant.city?.name}
                          />
                          <DetailItem
                            icon={<User size={16} />}
                            label="Branches"
                            value={restaurant.branches}
                          />
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50/50 border-t border-gray-200 rounded-b-xl">
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full justify-center text-(--primary)"
                        >
                          <Link to={`/restaurants/${restaurant.id}`}>
                            View Restaurant Details
                            <ArrowRight className="ml-2" size={16} />
                          </Link>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 border-t flex items-center justify-center">
                      <p className="text-(--secondaryFont)">
                        This owner is not currently assigned to a branch.
                      </p>
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default OwnerDetails;
