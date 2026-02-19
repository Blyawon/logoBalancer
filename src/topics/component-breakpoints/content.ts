export const MEDIA_QUERY_CODE = `/* ❌ Component uses @media — tied to viewport */
.card {
  display: flex;
  flex-direction: column;
}

@media (min-width: 480px) {
  .card {
    flex-direction: row;
  }
}`

export const CONTAINER_QUERY_CODE = `/* ✅ Component uses @container — tied to its space */
.card-wrapper {
  container-type: inline-size;
}

.card {
  display: flex;
  flex-direction: column;
}

@container (min-width: 480px) {
  .card {
    flex-direction: row;
  }
}`

export const FLUID_CODE = `/* ✅ No breakpoints at all — smooth scaling */
.card {
  padding: clamp(12px, 3cqi, 20px);
  font-size: clamp(13px, 3cqi, 17px);
  gap: clamp(6px, 1.5cqi, 12px);
}`

