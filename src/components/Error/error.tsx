import { useNavigate } from "@solidjs/router";
import "./error.scss";
import { Mode } from "../../types/settings";
import { SettingsContext } from "../../context/settingsContext";
import { useContext } from "solid-js";

export function ErrorPage() {
  const navigate = useNavigate();
  const { setMode } = useContext(SettingsContext);

  return (
    <div class="error-page">
      <h1>Not found</h1>
      <button
        onClick={() => {
          navigate("/anime");
          setMode(Mode.none);
        }}
      >
        Return Home
      </button>
    </div>
  );
}
