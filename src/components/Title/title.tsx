import "./title.scss";
import { useContext } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { SettingsContext } from "../../context/settingsContext";
import { Mode } from "../../types/settings";
import { Icon } from "../Icons/icon";
import { Title as TitleType } from "../../types/titles";

export function Title({ title }: { title: TitleType }) {
  const { setMode, setCurrentTitle } = useContext(SettingsContext);
  const navigate = useNavigate();
  const defaultSrc = "/anime/default-thumbnail.png";

  return (
    <div
      class="title"
      onClick={(event) => {
        event.preventDefault();
        setCurrentTitle(title);
        setMode(Mode.episode);
        navigate(`/anime?show_id=${title._id}`);
      }}
    >
      <img
        src={title.thumbnail || defaultSrc}
        alt={title.englishName || title.name}
        onError={(e) => {
          const img = e.currentTarget;
          if (!img.dataset.fallback) {
            img.dataset.fallback = "true";
            img.src = defaultSrc;
          }
        }}
      />
      <Icon
        name="play_arrow filled"
        className="play-arrow material-icons-round"
      />
      <h3 class="thumbnail-title">{title.englishName || title.name}</h3>
    </div>
  );
}
