import { Outlet, useLocation } from "react-router"; // Changed to react-router
import renderStars from "../util/renderStars";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { useRef, useState } from "react";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useChangeReviewsStatusMutation,
  useComplaintsQuery,
  useDeleteReviewMutation,
  useReportsQuery,
} from "../store/apiSlice/apiSlice"; // Corrected import path
import ReviewsSkeleton from "../components/skeleton/ReviewsSkeleton";
import EmptySection from "../components/EmptySection";
import { toast, Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { openConfirmPopUp } from "../store/reportSlice";
import ConfirmPopUp from "../components/ConfirmPopUp";

const Reviews = () => {
  const dispatch = useDispatch();
  const { confirmPopUpOpened } = useSelector((state) => state.report);
  const [date, setDate] = useState(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [reviewID, setReviewID] = useState();
  const location = useLocation();
  const condition = location.pathname.endsWith("delivery-employee-reviews");
  const menuRef = useRef(null);

  // Fetching complaints data
  const { data: reviews, isLoading, refetch } = useComplaintsQuery();
  const {
    data: reports,
    isLoading: reportsIsLoading,
    refetch: reftechReports,
  } = useReportsQuery();
  const [changeStatus, { isLoading: changeReviewsStatusIsLoading }] =
    useChangeReviewsStatusMutation();
  const [deleteReview, { isLoading: deleteReviewIsLoading }] =
    useDeleteReviewMutation();

  const complaints =
    reviews?.map((c) => ({
      id: c.id,
      userId: c.user_id,
      type: c.type,
      status: c.status,
      rating: c.score,
      message: c.message,
      userName: c.user?.name || "Anonymous", // Fallback for user name
      date: c.created_at ? new Date(c.created_at).toLocaleDateString() : "N/A", // Format date
      feedbackType: c.feedback_type?.target_type,
    })) || []; // Default to an empty array if reviews is undefined

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await changeStatus({
        id: complaintId,
        status: newStatus,
      }).unwrap();
      toast.success("Review status updated successfully!", {
        style: {
          background: "white",
          color: "#A1CA46",
          border: "1px solid hsl(var(--border))",
        },
      });
      refetch();
      reftechReports();
    } catch (error) {
      toast.error(error.data.error, {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };
  const handleDeleteReview = async () => {
    try {
      await deleteReview(reviewID).unwrap();
      toast.success("Review has been deleted successfully.", {
        style: {
          background: "white",
          color: "#A1CA46",
          border: "1px solid hsl(var(--border))",
        },
      });
      dispatch(openConfirmPopUp(false));
      reftechReports();
      refetch();
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

  return (
    <>
      <Toaster position="top-center" richColors />
      {confirmPopUpOpened && (
        <ConfirmPopUp
          loading={deleteReviewIsLoading}
          onConfirm={handleDeleteReview}
          onCancel={() => dispatch(openConfirmPopUp(false))}
          title="Confirm Deletion"
          content={`Are you sure you want to delete review? This action cannot be undone.`}
        />
      )}

      <main className="text-(--primaryFont) p-5 sm:p-10">
        <header className="flex items-center justify-between font-bold ">
          <span className="text-lg text-center sm:text-2xl">Reviews</span>
        </header>

        {!condition ? (
          isLoading ? (
            <ReviewsSkeleton />
          ) : (
            <>
              <div className="sm:text-end mt-10 pb-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="basis-1/2 w-full sm:w-fit min-w-[225px] focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-10 placeholder-(--secondaryFont) text-(--secondaryFont)"
                    >
                      {date ? format(date, "PPP") : <span>Filter by Date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      className="text-(--primaryFont)"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <section className="text-sm sm:text-base border-t-2 border-(--border-color)">
                {complaints.length > 0 ? (
                  complaints.map((review) => (
                    <div
                      key={review.id}
                      className="mt-10 py-10 lg:px-40 w-full flex flex-col lg:flex-row gap-5 lg:gap-10 border-b-2 border-(--border-color)"
                    >
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
                            <button
                              onClick={() => {
                                setReviewID(review.id);
                                dispatch(openConfirmPopUp(true));
                              }}
                              className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-center lg:items-start gap-5">
                        <img
                          src="/person.png"
                          className="rounded-full w-20 h-20"
                          alt="User avatar"
                        />
                      </div>
                      <div className="w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <h1 className="text-2xl font-bold text-(--primaryFont)">
                            {review.userName}
                            <span className="ml-3 text-xs font-medium text-gray-500 bg-gray-200 py-1 px-2 rounded-full">
                              {review.status}
                            </span>
                          </h1>
                          {/* Change Status Dropdown */}
                          <Select
                            value={review.status}
                            onValueChange={(newStatus) =>
                              handleStatusChange(review.id, newStatus)
                            }
                            defaultValue={review.status}
                            disabled={changeReviewsStatusIsLoading}
                          >
                            <SelectTrigger className="w-full sm:w-[180px] mt-2 sm:mt-0">
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under_review">
                                Under-review
                              </SelectItem>
                              <SelectItem value="resloved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <span className="flex text-(--secondaryFont) font-bold gap-3 my-2">
                          {renderStars(review.rating)} {review.date}
                        </span>
                        <p className="text-(--secondaryFont) tracking-wider mt-2">
                          {review.message}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="mx-auto py-10">
                    <EmptySection
                      message={"There are no customer reviews to display."}
                      title={"No Reviews Found"}
                    />
                  </div>
                )}
              </section>

              {complaints.length > 0 && (
                <Pagination className="mt-10 text-(--secondaryFont)">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        className="hover:bg-primary hover:text-white"
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        className="hover:bg-primary hover:text-white"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        isActive
                        className="hover:bg-primary hover:text-white"
                      >
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        className="hover:bg-primary hover:text-white"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )
        ) : (
          <Outlet />
        )}
      </main>
    </>
  );
};

export default Reviews;
