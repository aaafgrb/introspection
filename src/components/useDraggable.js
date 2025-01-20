import { useZoomContext } from "./useZoomContext";

export function useDraggable({ onDrag, condition }) {
  const zoom = useZoomContext();
  let lastMouseX
  let lastMouseY

  const onMouseMove = (event) => {
    const dx = (event.clientX - lastMouseX) / zoom.value;
    const dy = (event.clientY - lastMouseY) / zoom.value;

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    if (onDrag) {
      onDrag(dx, dy);
    }
  };

  const onMouseDown = (event) => {
    if (condition && !condition(event)) {
      return; // Abort if condition is not met
    }

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    const onMouseUp = () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return {
    onMouseDown,
  };
}
