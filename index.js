// Utility Functions
const generateId = () => {
  // sometimes Date.now() is the same, so I use a random number to add to it
  // to make it unique.
  // Note: this is not a perfect solution and it is always better to use a
  // library that generates unique ids like uuid. But I am using this to
  // just get an idea of how to generate unique ids.
  const uniqueIdPart1 = Date.now().toString(36).slice(-4).toUpperCase();
  const uniqueIdPart2 = Math.random().toString(36).slice(3, 7).toUpperCase();
  return `${uniqueIdPart1}${uniqueIdPart2}`;
};

const createBook = ({title, author, pages, img_url}) => {
  return {
    id: generateId(),
    title,
    author,
    pages,
    img_url,
    read: false,
  };
};

// IIFE to create a libraryDB to manage the books
const libraryDB = (() => {
  let books = [
    { id: "ABC1", title: "The Adventures of Sherlocks Holmes", author: "Sir Arthur Conan Doyle", pages: 233, img_url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328861130i/831277.jpg", read: false },
    { id: "ABC2", title: "Around The World in 80 Days", author: "Jules Verne", pages: 203, img_url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328858853i/556766.jpg", read: true },
    { id: "ABC3", title: "To Kill a Mockingbird", author: "Harper Lee", pages: 281, img_url: "https://images.penguinrandomhouse.com/cover/9780061120084", read: false },
    { id: "ABC4", title: "The Great Gatsby", author: "F. Scott Fitzgerald", pages: 180, img_url: "https://images.penguinrandomhouse.com/cover/9780743273565", read: true },
    { id: "ABC5", title: "1984", author: "George Orwell", pages: 328, img_url: "https://images.penguinrandomhouse.com/cover/9780451524935", read: true },
    { id: "ABC6", title: "Pride and Prejudice", author: "Jane Austen", pages: 279, img_url: "https://images.penguinrandomhouse.com/cover/9780679783268", read: false },
    { id: "ABC7", title: "The Catcher in the Rye", author: "J.D. Salinger", pages: 224, img_url: "https://images.penguinrandomhouse.com/cover/9780241950425", read: true },
    { id: "ABC8", title: "The Lord of the Rings", author: "J.R.R. Tolkien", pages: 1178, img_url: "https://images.penguinrandomhouse.com/cover/9780261103252", read: false },
    { id: "ABC9", title: "The Hunger Games", author: "Suzanne Collins", pages: 374, img_url: "https://images.penguinrandomhouse.com/cover/9780439023481", read: true },
    { id: "ABC10", title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", pages: 309, img_url: "https://images.penguinrandomhouse.com/cover/9780590353403", read: true },
];

  const bookExists = (id) => books.some(book => book.id === id);

  const findBook = (id) => books.find(book => book.id === id);

  const addBook = (book) => {
    if (!book || typeof book !== 'object' || !book.id || !book.title) {
      return { success: false, message: 'Invalid book data. Please provide a valid book object with id and title.' };
    }

    if (bookExists(book.id)) {
      return { success: false, message: 'Book with the same ID already exists.' };
    }
    books.push(book);
    return { success: true, message: 'Book added successfully.', book };
  }
  
  const removeBook = (id) => {
    if (bookExists(id)) {
      books = books.filter(book => book.id !== id);
      return { success: true, message: 'Book removed successfully.' };
    }
    return { success: false, message: 'Book not found. No action taken.' };
  };

  const updateReadStatus = (id) => {
    const book = findBook(id);
    if (book) {
      book.read = !book.read;
      return { success: true, message: 'Read Status updated successfully.' };
    }
    return { success: false, message: 'Book not found. No action taken.' };
  };

  const updateBook = (id, { title, author, pages, img_url }) => {
    const book = findBook(id);
    if (book) {
      book.title = title;
      book.author = author;
      book.pages = pages;
      book.img_url = img_url;
      return { success: true, message: 'Book updated successfully.', book };
    }
    return { success: false, message: 'Book not found. No action taken.' };
  };

  return {
    get books() { return [...books] }, // returns a copy of the books preventing external modification
    addBook,
    removeBook,
    updateReadStatus,
    updateBook,
    findBook,
  };
})();

// DOM Manipulation
const cardTemplate = ({ title, author, pages, img_url, read }) =>
  `<img src="${img_url}" alt="${title}" />
    <h2>${title}</h2>
    <p>By ${author}</p>
    <div>
      <span>${pages}pages</span>
      <label>Status:
        <input type="checkbox" class="checkbox" ${read ? "checked" : ""} data-action="toggle">
      </label>
    </div>
    <button type="button" class="iconBtn" data-action="showEditModal"></button>
    <button type="button" class="iconBtn" data-action="delete"></button>`;

const createBookCard = (book) => {
  const card = document.createElement('article');
  card.classList.add('book-card');
  card.dataset.id = book.id;
  card.innerHTML = cardTemplate(book);
  return card;
}

const updateBookCard = (book) => {
  const card = document.querySelector(`article[data-id="${book.id}"]`);
  card.innerHTML = cardTemplate(book);
  return card;
};

const renderBooks = (books) => {
  const fragment = document.createDocumentFragment();
  books.forEach(book => fragment.appendChild(createBookCard(book)));
  document.querySelector('main').appendChild(fragment);
};

const appendBook = (book) => {
  const main = document.querySelector('main');
  // document.querySelector('main').appendChild(createBookCard(book));
  main.insertBefore(createBookCard(book), main.firstChild);
};

// "Show the dialog" button opens the <dialog> modally
const displayDialog = (title, action) => {
  const dialog = document.getElementById("modalDialog");
  const h2 = dialog.querySelector("h2");
  const form = dialog.querySelector("form");
  h2.textContent = title;
  form.dataset.action = action;
  dialog.showModal();
};

// populate the form with the book details
const populateForm = (book) => {
  const form = document.getElementById("modalForm");
  const inputFields = form.querySelectorAll("input[name]");

  inputFields.forEach(input => {
    const prop = input.getAttribute("name");
    if (prop in book) {
      console.log(prop);
      input.value = book[prop];
    }
  });
};

// Event Handlers
const handleAddBook = (bookData) => {
  const newBook = createBook(bookData);
  const { success, message, book } = libraryDB.addBook(newBook);
  if (success) appendBook(book);
  return { success, message};
};

const handleUpdateBook = (id, updatedBook) => {
  const { success, message, book } = libraryDB.updateBook(id, updatedBook);
  if (success) updateBookCard(book);
  return { success, message };
};

const handleMainClick = (e) => {
  const action = e.target.dataset.action;
  const card = e.target.closest('article');
  const id = card.dataset.id;
  let result;
  switch (action) {
    case "delete":
      result = libraryDB.removeBook(id);
      if (result.success) card.remove();
      break;
    case "showEditModal":
      const book = libraryDB.findBook(id);
      if (!book) return alert("Book not found.");
      populateForm(book);
      displayDialog("Edit Book Details", "updateDetails");
      break;

    default:
      // no action
      break;
  }
};

const handleChangeCheckbox = (e) => {
  const action = e.target.dataset.action;
  if (action !== "toggle") return;
  const checkbox = e.target;
  const card = checkbox.closest("article");
  const id = card.dataset.id;
  const result = libraryDB.updateReadStatus(id);
  if (!result.success) {
    checkbox.checked = !checkbox.checked;
  }
  console.log(result);
};

const handleModalFormSubmit = (e) => {
  e.preventDefault();
  console.log('run');
  const dialog = e.target.closest('dialog');
  const form = e.target;
  const action = form.dataset.action;
  const formData = new FormData(form);
  const bookData = Object.fromEntries(formData.entries())
  bookData.img_url = bookData.img_url || "https://via.placeholder.com/300x200?text=Image+Not+Available";
  const id = form.querySelector("input[name='id']").value;
  
  const { success, message } =
    action === "addNew"
      ? handleAddBook(bookData)
      : handleUpdateBook(id, bookData);

  if (success) {
    form.reset();
    dialog.close();
  } else {
    alert(message);
  }
};

const handleModalCancelBtn = (e) => {
  e.preventDefault();
  console.log('run');
  const dialog = e.target.closest('dialog');
  const form = dialog.querySelector('form');
  form.reset();
  dialog.close();
};

// Initialization
const main = () => {
  const btnAddNewBook = document.getElementById("showAddModal");
  const cardContainer = document.querySelector("main");
  renderBooks(libraryDB.books);

  // Event Listeners
  btnAddNewBook.addEventListener("click", () =>
    displayDialog("Add New Book", "addNew")
  );
  cardContainer.addEventListener("click", handleMainClick);
  cardContainer.addEventListener("change", handleChangeCheckbox);
  document
    .getElementById("modalForm")
    .addEventListener("submit", handleModalFormSubmit);
  document
    .getElementById("cancelBtn")
    .addEventListener("click", handleModalCancelBtn);
};

// Run the main function when the document is ready
document.addEventListener("DOMContentLoaded", main);
