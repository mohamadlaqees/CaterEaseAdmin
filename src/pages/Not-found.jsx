import { Button } from "@/components/ui/button";
import { Link } from "react-router"; // Use Link for client-side navigation

const NotFoundPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        fontFamily: "sans-serif",
        backgroundColor: "#f8f9fa",
      }}
    >
      <h1 style={{ fontSize: "10rem", margin: 0 }} className="text-(--primary)">
        404
      </h1>
      <h2 style={{ fontSize: "2rem", margin: "0 0 1rem 0", color: "#495057" }}>
        Page Not Found
      </h2>
      <p style={{ color: "#6c757d", maxWidth: "400px", marginBottom: "2rem" }}>
        Sorry, the page you are looking for does not exist. It might have been
        moved or deleted.
      </p>
      <Link to="/">
        <Button size="lg" className="cursor-pointer">
          Go To Home Page
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
