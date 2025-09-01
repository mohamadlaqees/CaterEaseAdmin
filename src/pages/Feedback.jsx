// src/pages/FeedbackPage.js

import { useState } from "react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "sonner";
import { CalendarIcon } from "lucide-react";

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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import ConfirmPopUp from "../components/ConfirmPopUp";
import EmptySection from "../components/EmptySection";

// Import Hooks, Components & Utilities
import {
  useChangeFeedbackStatusMutation,
  useChangeReportStatusMutation,
  useComplaintsQuery,
  useDeleteReviewMutation,
  useReportsQuery,
} from "../store/apiSlice/apiSlice";
import { openConfirmPopUp } from "../store/feedbackSlice";
import renderStars from "../util/renderStars";
import FeedbackDetails from "../components/FeedbackDetails"; // The generic details modal
import FeedbackSkeleton from "../components/skeleton/FeedbackSkeleton";

// --- A simplified, reusable list item component ---
const FeedbackListItem = ({ item, onClick }) => (
  <div
    className="p-6 mb-4 border rounded-lg shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
    onClick={onClick}
  >
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold text-(--primaryFont) truncate pr-4">
        {item.title}
      </h2>
      <span className="text-xs flex-shrink-0 font-medium text-(--secondaryFont) bg-gray-200 py-1 px-2 rounded-full capitalize">
        {item.status.replace("_", " ")}
      </span>
    </div>
    <div className="flex items-center justify-between mt-2 text-sm text-(--secondaryFont)">
      <span>Submitted on: {item.date}</span>
      {item.type === "complaint" && (
        <span className="flex items-center gap-1">
          {renderStars(item.rating)}
        </span>
      )}
    </div>
  </div>
);

const FeedbackPage = () => {
  const dispatch = useDispatch();
  const { confirmPopUpOpened } = useSelector((state) => state.feedback);
  const [date, setDate] = useState(null);
  const [activeTab, setActiveTab] = useState("complaints");

  // --- STATE FOR MODALS ---
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // --- DATA FETCHING ---
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
  const [changeStatus, { isLoading: changeStatusIsLoading }] =
    useChangeFeedbackStatusMutation(undefined, {
      skip: activeTab === "reports",
    });
  const [changeReportStatus, { isLoading: changeReportStatusIsLoading }] =
    useChangeReportStatusMutation(undefined, {
      skip: activeTab === "complaints",
    });
  const [deleteItem, { isLoading: deleteIsLoading }] =
    useDeleteReviewMutation();

  // --- UNIFIED DATA TRANSFORMATION ---
  const reportsInfo = reports?.map((r) => ({
    type: "report", // Add a type identifier
    id: r.id,
    status: r.status,
    title: r.subject, // Use generic 'title'
    details: r.details,
    date: r.created_at ? format(new Date(r.created_at), "PPP") : "N/A",
    branch: r.branch,
  }));

  const complaintsInfo = reviews?.map((c) => ({
    type: "complaint", // Add a type identifier
    id: c.id,
    status: c.status,
    title: `Review to ${c.user?.name || "Anonymous"}`, // Use generic 'title'
    details: c.message,
    date: c.created_at ? format(new Date(c.created_at), "PPP") : "N/A",
    rating: c.score,
    authorName: c.user?.name || "Anonymous",
    branch: c.branch,
  }));

  // --- EVENT HANDLERS ---
  const handleStatusChange = async (id, newStatus) => {
    console.log(activeTab);
    try {
      if (activeTab === "complaints") {
        await changeStatus({ reviewID: id, status: newStatus }).unwrap();
      } else {
        await changeReportStatus({ reviewID: id, status: newStatus }).unwrap();
      }
      toast.success("Status updated successfully!", {
        style: {
          background: "white",
          color: "#314E76",
          border: "1px solid hsl(var(--border))",
        },
      });
      setSelectedFeedback(null); // Close modal on success
      refetchComplaints();
      refetchReports();
    } catch (error) {
      toast.error(error?.data?.error || "Failed to update status.", {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    dispatch(openConfirmPopUp(true));
  };

  const handleDelete = async () => {
    try {
      await deleteItem(deleteId).unwrap();
      toast.success("Item has been deleted successfully.", {
        style: {
          background: "white",
          color: "#314E76",
          border: "1px solid hsl(var(--border))",
        },
      });
      dispatch(openConfirmPopUp(false));
      if (selectedFeedback?.id === deleteId) {
        setSelectedFeedback(null); // Close details modal if it was open
      }
      refetchComplaints();
      refetchReports();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete item.", {
        style: {
          background: "white",
          color: "#ef4444",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  const isLoading =
    activeTab === "complaints" ? complaintsIsLoading : reportsIsLoading;
  const dataToDisplay =
    activeTab === "complaints" ? complaintsInfo : reportsInfo;

  return (
    <>
      <Toaster position="top-center" richColors />

      {selectedFeedback && (
        <FeedbackDetails
          feedback={selectedFeedback}
          closeHandler={() => setSelectedFeedback(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteClick}
          statusChangeLoading={
            activeTab === "complaint"
              ? changeStatusIsLoading
              : changeReportStatusIsLoading
          }
        />
      )}

      <main className="text-(--primaryFont) p-5 sm:p-10">
        {confirmPopUpOpened && (
          <ConfirmPopUp
            loading={deleteIsLoading}
            onConfirm={handleDelete}
            onCancel={() => dispatch(openConfirmPopUp(false))}
            title="Confirm Deletion"
            content={`Are you sure you want to delete this ${
              activeTab === "complaints" ? "review" : "report"
            }? This action cannot be undone.`}
          />
        )}
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

        <div className="mt-6">
          {isLoading ? (
            <FeedbackSkeleton type={activeTab} />
          ) : !dataToDisplay || dataToDisplay.length === 0 ? (
            <EmptySection
              title={
                activeTab === "complaints"
                  ? "No Reviews Found"
                  : "No Reports Found"
              }
              message="There is no feedback to display at this time."
            />
          ) : (
            dataToDisplay.map((item) => (
              <FeedbackListItem
                key={`${item.type}-${item.id}`}
                item={item}
                onClick={() => setSelectedFeedback(item)}
              />
            ))
          )}
        </div>

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
      </main>
    </>
  );
};

export default FeedbackPage;
