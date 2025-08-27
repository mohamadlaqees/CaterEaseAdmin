import { X } from "lucide-react"; // Assuming X is your close icon
import { Button } from "@/components/ui/button";
import LoadingButton from "./LoadingButton";

const ConfirmPopUp = ({
  content, // The message to display (e.g., "Are you sure you want to delete this item?")
  onConfirm, // Callback function when user confirms
  onCancel, // Callback function when user cancels
  loading,
}) => {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-30 z-40" // Use fixed and inset-0 for full screen overlay
        onClick={onCancel} // Allow clicking outside to cancel
      />

      {/* Modal Content */}
      <div
        className={`fixed bg-white text-sm sm:text-base text-(--primaryFont) p-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md z-50
                   w-[90%] sm:w-[100%] max-w-md `} // Adjusted width for better responsiveness
      >
        <div className="flex justify-end">
          <X
            className="transition-all hover:brightness-20 cursor-pointer text-(--secondaryFont)" // Added text color for visibility
            size={24} // Slightly smaller for better fit
            onClick={onCancel}
          />
        </div>

        <div className="text-center my-6">
          <p className="text-lg font-semibold mb-4">{content}</p>
          <p className="text-(--secondaryFont)">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            type="button"
            variant="outline"
            className="text-(--secondaryFont) hover:text-(--primary) cursor-pointer "
            onClick={onCancel}
          >
            Cancel
          </Button>
          <div onClick={onConfirm}>
            <LoadingButton
              variant={"destructive"}
              btnClass={
                "w-full sm:w-auto h-10 text-sm cursor-pointer  hover:brightness-105 transition-all text-white"
              }
              disabled={loading}
              isButton={true}
              loadingText={"Confirming..."}
              text={"Confirm"}
              type={"button"}
              spinColor={"#e75858"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmPopUp;
