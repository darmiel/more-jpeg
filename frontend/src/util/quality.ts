export function getColorForQuality(
  quality: number,
): "danger" | "warning" | "success" | "primary" {
  if (quality <= 25) {
    return "danger"
  }
  if (quality <= 50) {
    return "warning"
  }
  if (quality <= 75) {
    return "primary"
  }
  return "success"
}
