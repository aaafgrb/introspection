import { provide, inject, computed, ref } from "vue";

const ZoomContextKey = Symbol("ZoomContext");

export function provideZoomContext(localZoom) {
  // Retrieve the parent's cumulative zoom (default is 1 if no parent exists)
  const parentZoom = inject(ZoomContextKey, ref(1));

  // Combine the parent's zoom with the local zoom
  const cumulativeZoom = computed(() => parentZoom.value * localZoom.value);

  // Provide the cumulative zoom to children
  provide(ZoomContextKey, cumulativeZoom);

  // Return both the local and cumulative zoom
  return { localZoom, cumulativeZoom };
}

export function useZoomContext() {
  // Retrieve the cumulative zoom (default to 1 if no provider exists)
  return inject(ZoomContextKey, ref(1));
}
