export function jsonFixer(mangledJSON) {
  if (mangledJSON.lastIndexOf("]") === -1) {
    mangledJSON += "]";
  }
  return mangledJSON.slice(
    mangledJSON.indexOf("["),
    mangledJSON.lastIndexOf("]") + 1
  );
}
