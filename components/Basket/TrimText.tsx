export const trimTextToWholeWords = (text: string, maxLength: number): string => {
  if (maxLength < 3) {
    return "Длина слишком короткая";
  }
  let trimmedText = text.substr(0, maxLength);
  if (trimmedText.length < text.length) {
    const lastSpaceIndex = trimmedText.lastIndexOf(" ");
    trimmedText = lastSpaceIndex !== -1 ? trimmedText.substr(0, lastSpaceIndex) : trimmedText;
  }

  if (trimmedText[trimmedText.length - 2] === " ") {
    trimmedText = trimmedText.substr(0, trimmedText.length - 2);
  }
  return trimmedText.endsWith(".") ? trimmedText : trimmedText.trim();
};
