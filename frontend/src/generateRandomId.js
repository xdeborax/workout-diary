export default function generateRandomId() {
  return Date.now().toString(36) + Math.random().toString(36);
}
