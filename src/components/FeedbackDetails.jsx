// src/components/FeedbackDetails.js

import { X, Trash2, User, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import renderStars from "../util/renderStars"; // Assuming you have this utility

// A small helper component for displaying info items
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-(--secondaryFont)">{label}</p>
    <p className="text-base font-semibold text-(--primaryFont)">
      {value || "N/A"}
    </p>
  </div>
);

const FeedbackDetails = ({
  feedback,
  closeHandler,
  onStatusChange,
  onDelete,
  statusChangeLoading,
}) => {
  if (!feedback) return null;

  const isReport = feedback.type === "report";
  const isComplaint = feedback.type === "complaint";

  return (
    <>
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-40 z-30"
        onClick={closeHandler}
      />
      <div className="fixed bg-white text-sm sm:text-base text-(--primaryFont) p-6 sm:p-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[50%] max-w-2xl h-fit max-h-[90vh] overflow-y-auto rounded-lg shadow-xl z-40">
        <header className="text-lg sm:text-xl flex justify-between items-center font-bold mb-6 pb-4 border-b">
          <span>{isReport ? "Report Details" : "Complaint Details"}</span>
          <X
            className="transition-all hover:brightness-20 cursor-pointer"
            size={26}
            onClick={closeHandler}
          />
        </header>

        <div className="space-y-6">
          {/* --- Main Details --- */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-(--primary)">
              {feedback.title} {/* Use generic 'title' */}
            </h2>

            {/* Conditionally render user/rating info for complaints */}
            {isComplaint && (
              <div className="flex items-center gap-4 text-(--secondaryFont)">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{feedback.authorName}</span>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(feedback.rating)}
                </div>
              </div>
            )}

            <p className="text-(--primaryFont) leading-relaxed">
              {feedback.details}
            </p>

            <div className="flex items-center justify-between text-xs pt-2 text-(--secondaryFont)">
              <span>Submitted on: {feedback.date}</span>
              <span className="font-medium bg-gray-200 py-1 px-3 rounded-full capitalize text-(--primaryFont)">
                Status: {feedback.status.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* --- Branch Information (if available) --- */}
          {feedback.branch && (
            <div className="p-4 border rounded-md bg-gray-50">
              <h3 className="font-bold text-lg mb-3 text-(--primaryFont)">
                Branch Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem
                  label="Branch Name"
                  value={feedback.branch.description}
                />
                <InfoItem
                  label="Manager"
                  value={feedback.branch.manager?.name}
                />
                <InfoItem label="City" value={feedback.branch.city?.name} />
              </div>
            </div>
          )}

          {/* --- Actions --- */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t">
            <div className="w-full sm:w-auto">
              <label className="text-sm font-medium text-(--primaryFont)">
                Change Status
              </label>
              <Select
                value={feedback.status}
                onValueChange={(newStatus) =>
                  onStatusChange(feedback.id, newStatus)
                }
                disabled={statusChangeLoading}
              >
                <SelectTrigger className="w-full sm:w-[180px] mt-1 text-(--secondaryFont)">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent className="text-(--secondaryFont)">
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="destructive"
              onClick={() => onDelete(feedback.id)}
              className="w-full sm:w-auto self-end hover:brightness-105  cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackDetails;
