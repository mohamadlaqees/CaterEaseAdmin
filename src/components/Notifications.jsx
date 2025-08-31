import { onMessage } from "firebase/messaging";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNotification,
  clearAllNotifications,
  markAllAsRead,
} from "../store/notificationsSlice";
import { messaging } from "../firebase";

const Notifications = ({ notificationsRef, isOpen }) => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.notification);

  useEffect(() => {
    console.log("fetch");
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received: ", payload);

      const newNotification = {
        id: payload.messageId || new Date().getTime(),
        title: payload.notification.title,
        body: payload.notification.body,
        icon: payload.notification.icon,
        receivedAt: new Date().toISOString(),
      };

      dispatch(addNotification(newNotification));
    });
    return () => {
      console.log("Unsubscribing from foreground messages.");
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      dispatch(markAllAsRead());
    }
  }, [isOpen, dispatch]);

  return (
    <div
      ref={notificationsRef}
      className={`max-[400px]:-right-15 max-[400px]:top-10 transition-all
       ${
         isOpen
           ? "opacity-100 translate-y-0 pointer-events-auto"
           : "opacity-0 -translate-y-2 pointer-events-none"
       } border-2 border-(--border-color)  w-xs overflow-hidden  hover:overflow-y-scroll custom-scrollbar  h-80 text-(--primaryFont) bg-white rounded-md absolute  top-8 right-0 z-60 `}
    >
      <header className="border-b-2 border-(--border-color) w-full flex justify-between px-4 py-3">
        Notifications
        <button
          className="text-sm cursor-pointer outline-0 text-(--secondaryFont)"
          onClick={() => dispatch(clearAllNotifications())}
        >
          Clear All
        </button>
      </header>
      {items?.map((n) => {
        const date = new Date(n.receivedAt);
        const time12Hour = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        return (
          <div
            key={n.id}
            className=" mb-1 flex gap-4 p-2 cursor-pointer transition-all hover:bg-accent"
          >
            <img className="w-14 h-14 rounded-full" src="/person.png" alt="" />
            <div className="w-full">
              <div className="w-full flex items-center justify-between">
                <h1>{n.title}</h1>
                <span className="text-[#7779] text-xs">{time12Hour}</span>
              </div>
              <p className="text-sm text-(--secondaryFont)">{n.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Notifications;
