import { useState } from "react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "sonner";
import { CalendarIcon, Trash2 } from "lucide-react";

// Import UI Components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmPopUp from "../components/ConfirmPopUp";
import EmptySection from "../components/EmptySection";

// Import Hooks & Utilities
import {
  useChangeFeedbackStatusMutation,
  useComplaintsQuery,
  useDeleteReviewMutation,
  useReportsQuery,
} from "../store/apiSlice/apiSlice";
import { openConfirmPopUp } from "../store/feedbackSlice";
import renderStars from "../util/renderStars";
import FeedbackSkeleton from "../components/skeleton/FeedbackSkeleton";

// --- Helper Component for Reports Section ---
const ReportsSection = ({
  reports,
  isLoading,
  onStatusChange,
  onDelete,
  isStatusUpdating,
}) => {
  if (isLoading) return <FeedbackSkeleton />;
  if (!reports || reports.length === 0) {
    return (
      <div className="py-10">
        <EmptySection
          title="No Reports Found"
          message="There are no reports to display at this time."
        />
      </div>
    );
  }

  return (
    <section className="text-sm sm:text-base border-t-2 border-(--border-color) pt-6">
      {reports.map((report) => (
        <div
          key={report.id}
          className="p-6 mb-4 border rounded-lg shadow-sm bg-white"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-(--primaryFont)">
              {report.subject}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(report.id)}
              className="text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
            <span className="text-xs font-medium text-gray-500 bg-gray-200 py-1 px-2 rounded-full capitalize">
              {report.status}
            </span>
            <Select
              value={report.status}
              onValueChange={(newStatus) =>
                onStatusChange(report.id, newStatus)
              }
              disabled={isStatusUpdating}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-(--secondaryFont) mb-4">
            Reported on: {report.date}
          </p>
          <p className="text-(--primaryFont) tracking-wider">
            {report.details}
          </p>
        </div>
      ))}
    </section>
  );
};

// --- Helper Component for Complaints Section ---
const ComplaintsSection = ({
  complaints,
  isLoading,
  onStatusChange,
  onDelete,
  isStatusUpdating,
}) => {
  if (isLoading) return <FeedbackSkeleton />;
  if (!complaints || complaints.length === 0) {
    return (
      <div className="py-10">
        <EmptySection
          title="No Reviews Found"
          message="There are no customer reviews to display."
        />
      </div>
    );
  }

  return (
    <section className="text-sm sm:text-base border-t-2 border-(--border-color)">
      {complaints.map((review) => (
        <div
          key={review.id}
          className="mt-10 py-10 lg:px-40 w-full flex flex-col lg:flex-row gap-5 lg:gap-10 border-b-2 border-(--border-color)"
        >
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
                <span className="ml-3 text-xs font-medium text-gray-500 bg-gray-200 py-1 px-2 rounded-full align-middle">
                  {review.status.replace("_", " ")}
                </span>
              </h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(review.id)}
                className="text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="flex text-(--secondaryFont) font-bold gap-3 my-2">
                {renderStars(review.rating)} {review.date}
              </span>
              <Select
                value={review.status}
                onValueChange={(newStatus) =>
                  onStatusChange(review.id, newStatus)
                }
                disabled={isStatusUpdating}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-(--secondaryFont) tracking-wider mt-4">
              {review.message}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

const FeedbackPage = () => {
  const dispatch = useDispatch();
  const { confirmPopUpOpened } = useSelector((state) => state.feedback);
  const [date, setDate] = useState(null);
  const [reviewID, setReviewID] = useState(null);
  const [activeTab, setActiveTab] = useState("complaints");

  // Fetching data
  const {
    data: reviews,
    isLoading: complaintsIsLoading,
    refetch: refetchComplaints,
  } = useComplaintsQuery();
  const {
    data: reports,
    isLoading: reportsIsLoading,
    refetch: refetchReports,
  } = useReportsQuery();
  const [changeStatus, { isLoading: changeReviewsStatusIsLoading }] =
    useChangeFeedbackStatusMutation();
  const [deleteReview, { isLoading: deleteReviewIsLoading }] =
    useDeleteReviewMutation();

  // Data processing
  const reportsInfo = reports?.map((r) => ({
    id: r.id,
    managerId: r.manager_id,
    status: r.status,
    subject: r.subject,
    details: r.details,
    date: r.created_at ? new Date(r.created_at).toLocaleDateString() : "N/A",
  }));

  const complaints = reviews?.map((c) => ({
    id: c.id,
    userId: c.user_id,
    type: c.type,
    status: c.status,
    rating: c.score,
    message: c.message,
    userName: c.user?.name || "Anonymous",
    date: c.created_at ? new Date(c.created_at).toLocaleDateString() : "N/A",
    feedbackType: c.feedback_type?.target_type,
  }));

  // Event Handlers
  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await changeStatus({ id: complaintId, status: newStatus }).unwrap();
      toast.success("Review status updated successfully!");
      refetchComplaints();
      refetchReports();
    } catch (error) {
      toast.error(error?.data?.error || "Failed to update status.");
    }
  };

  const handleDeleteClick = (id) => {
    setReviewID(id);
    dispatch(openConfirmPopUp(true));
  };

  const handleDeleteReview = async () => {
    try {
      await deleteReview(reviewID).unwrap();
      toast.success("Review has been deleted successfully.");
      dispatch(openConfirmPopUp(false));
      refetchComplaints();
      refetchReports();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete review.");
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
          content="Are you sure you want to delete this review? This action cannot be undone."
        />
      )}

      <main className="text-(--primaryFont) p-5 sm:p-10">
        {/* --- Header with Title and Date Filter --- */}
        <header className="flex gap-2 items-start flex-col sm:flex-row sm:items-center justify-between font-bold mb-6">
          <span className="text-lg text-center sm:text-2xl">Feedback</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full sm:w-fit min-w-[225px] focus-visible:ring-(--primary) focus:border-0 border-(--border-color) border-2 h-10 placeholder-(--secondaryFont) text-(--secondaryFont)"
              >
                {date ? format(date, "PPP") : <span>Filter by Date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                className="text-(--primaryFont)"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </header>

        {/* --- Tab Navigation --- */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("complaints")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "complaints"
                  ? "border-(--primary) text-(--primary)"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Complaints & Reviews
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "reports"
                  ? "border-(--primary) text-(--primary)"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manager Reports
            </button>
          </nav>
        </div>

        {/* --- Content Area --- */}
        <div className="mt-6">
          {activeTab === "complaints" && (
            <ComplaintsSection
              complaints={complaints}
              isLoading={complaintsIsLoading}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteClick}
              isStatusUpdating={changeReviewsStatusIsLoading}
            />
          )}

          {activeTab === "reports" && (
            <ReportsSection
              reports={reportsInfo}
              isLoading={reportsIsLoading}
            />
          )}
        </div>

        <Pagination className="mt-10 text-(--secondaryFont)">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </main>
    </>
  );
};

export default FeedbackPage;
