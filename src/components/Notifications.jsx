const Notifications = ({ notifications, notificationsRef }) => {
  return (
    <div
      ref={notificationsRef}
      className={`max-[400px]:-right-15 max-[400px]:top-10 transition-all
       ${
         notifications
           ? "opacity-100 translate-y-0 pointer-events-auto"
           : "opacity-0 -translate-y-2 pointer-events-none"
       } border-2 border-(--border-color)  w-xs overflow-hidden  hover:overflow-y-scroll custom-scrollbar  h-80 text-(--primaryFont) bg-white rounded-md absolute  top-8 right-0 z-60 `}
    >
      <header className="border-b-2 border-(--border-color) w-full flex justify-between px-4 py-3">
        Notifications
        <button className="text-sm cursor-pointer outline-0 text-(--secondaryFont) hover:text-(--primary)">
          Clear All
        </button>
      </header>
      <div className=" mb-1 flex gap-4 p-2 cursor-pointer transition-all hover:bg-accent">
        <img className="w-14 h-14 rounded-full" src="/person.png" alt="" />
        <div>
          <div className="w-full flex items-center justify-between">
            <h1>Caleb Jack</h1>
            <span className="text-[#7779] text-xs">1 minute ago</span>
          </div>
          <p className="text-sm text-(--secondaryFont)">
            Caleb jack give a review on some food
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
