import { useNavigate } from "@solidjs/router";
import "./error.scss";

export function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div class="error-page">
      <h1>Not found</h1>
      <button onClick={() => navigate("/anime")}>Return Home</button>
    </div>
  );
}
