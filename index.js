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

  const bookExists = (id) => books.some(book => book.id === id);

  const setBook = (id) => books.find(book => book.id === id);

  const addBook = (book) => {
    if (!book || typeof book !== 'object' || !book.id || !book.title) {
      return { success: false, message: 'Invalid book data. Please provide a valid book object with id and title.' };
    }

    if (bookExists(book.id)) {
      return { success: false, message: 'Book with the same ID already exists.' };
    }
    books.push(book);
    return { success: true, message: 'Book added successfully.' };
  }
  
  const removeBook = (id) => {
    if (bookExists(id)) {
      books = books.filter(book => book.id !== id);
      return { success: true, message: 'Book removed successfully.' };
    }
    return { success: false, message: 'Book not found. No action taken.' };
  };

  const updateReadStatus = (id, updatedRead) => {
    if (bookExists(id)) {
      setBook(id).read = updatedRead;
      return { success: true, message: 'Read Status updated successfully.' };
    }
    return { success: false, message: 'Book not found. No action taken.' };
  };

  const updateBook = (id, updatedTitle, updatedAuthor, updatedPages, updatedRead) => {
    if (bookExists(id)) {
      const book = setBook(id);
      book.title = updatedTitle;
      book.author = updatedAuthor;
      book.pages = updatedPages;
      book.read = updatedRead;
      return { success: true, message: 'Book updated successfully.' };
    }
    return { success: false, message: 'Book not found. No action taken.' };
  };

  return {
    get books() { return [...books] }, // returns a copy of the books preventing external modification
    addBook,
    removeBook,
    updateReadStatus,
    updateBook,
  };
})();

console.log(libraryManager.books);
console.log(libraryManager.addBook({id: 'abc', title:'gjg', author: 'hgfhf', pages: 200, read: false}));
console.log(libraryManager.books);
console.log(libraryManager.removeBook('abc'));
console.log(libraryManager.books);
