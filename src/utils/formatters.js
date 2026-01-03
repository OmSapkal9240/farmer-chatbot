export const stripMarkdown = (text) => {
  return text
    .replace(/###/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/- /g, '');
};
