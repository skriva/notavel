export function stripFrontMatter (content) {
  return content.replace(/^---(\n|.)+---/g, '');
}
