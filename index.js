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

const libraryManager = (() => {
  let books = [
    { id: "ABC1", title: "The Adventures of Sherlocks Holmes", author: "Sir Authur Conan Doyle", pages: 233, read: false },
    { id: "ABC2", title: "Around The World in 80days", author: "Jules Verne", pages: 203, read: true },
  ];

  const getBooks = () => books;

  return {
    books: getBooks(),
  };
})();

console.log(libraryManager.books);