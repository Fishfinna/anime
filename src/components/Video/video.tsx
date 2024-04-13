import { createSignal } from "solid-js";

export interface Quality {
  quality: string;
  source: string;
}

export default function Video(props: { qualities: Quality[] }) {
  const [selectedQuality, setSelectedQuality] = createSignal<Quality>(
    props.qualities[0]
  );

  const handleQualityChange = (quality: Quality) => {
    setSelectedQuality(quality);
  };

  return (
    <div>
      <video controls>
        <source src={selectedQuality().source} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div>
        <h3>Select Quality:</h3>
        <ul>
          {props.qualities.map((quality) => (
            <li>
              <button onClick={() => handleQualityChange(quality)}>
                {quality.quality}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
