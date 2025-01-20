import { ref } from "vue"
import { provideZoomContext } from "./useZoomContext";

export function useZoomable({
  initialZoom = 1,
  minZoom = 0.5,
  maxZoom = 2,
  zoomStep = 0.1,
  condition
}) {
  const localZoom = ref(initialZoom); // Local zoom level
  const { cumulativeZoom } = provideZoomContext(localZoom);

  const onWheelZoom = (event, containerRef, contentPosition) => {
    if (!containerRef) return;

    if (condition && !condition(event)) {
      return; // Abort if condition is not met
    }

    event.preventDefault(); // Prevent default scroll behavior

    const delta = -event.deltaY / 100; // Normalize wheel delta
    const newZoom = Math.min(maxZoom, Math.max(minZoom, localZoom.value + delta * zoomStep));
    const scaleChange = newZoom / localZoom.value;

    // Get mouse position relative to the container
    const rect = containerRef.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Adjust content position to maintain focus on mouse position
    contentPosition.x = mouseX - (mouseX - contentPosition.x) * scaleChange;
    contentPosition.y = mouseY - (mouseY - contentPosition.y) * scaleChange;

    localZoom.value = newZoom;
  };

  return {
    localZoom,
    cumulativeZoom,
    onWheelZoom,
  };
}