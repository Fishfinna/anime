import { useNavigate } from "@solidjs/router";
import "./error.scss";

export function Error() {
  const navigate = useNavigate();
  return (
    <div class="error-page">
      <h1>Show not found</h1>
      <button onClick={() => navigate("anime")}>Return Home</button>
    </div>
  );
}
