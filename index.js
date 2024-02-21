const generateId = () => {
  // sometimes Date.now() is the same, so we use a random number to add to it
  // to make it unique.
  // Note: this is not a perfect solution and it is always better to use a
  // library that generates unique ids like uuid. But I am using this to
  // just get an idea of how to generate unique ids.
  const uniqueIdPart1 = Date.now().toString(36).slice(-4).toUpperCase();
  const uniqueIdPart2 = Math.random().toString(36).slice(3, 7).toUpperCase();
  return `${uniqueIdPart1}${uniqueIdPart2}`;
};

const createBook = (title, author, pages) => {
  return {
    id: generateId(),
    title,
    author,
    pages,
    read: false,
  };
};