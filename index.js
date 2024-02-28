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

const libraryDB = (() => {
  let books = [
    { id: "ABC1", title: "The Adventures of Sherlocks Holmes", author: "Sir Authur Conan Doyle", pages: 233, img_url: "https://indobanglabook.s3.us-east-2.amazonaws.com/9417/917q1pl1VIL.jpg", read: false },
    { id: "ABC2", title: "Around The World in 80days", author: "Jules Verne", pages: 203, img_url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328858853i/556766.jpg", read: true },
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

  const updateReadStatus = (id) => {
    if (bookExists(id)) {
      const book = setBook(id);
      book.read = !book.read;
      return { success: true, message: 'Read Status updated successfully.' };
    }
    return { success: false, message: 'Book not found. No action taken.' };
  };

  const updateBook = ({id, updatedTitle, updatedAuthor, updatedPages, updatedImgUrl}) => {
    if (bookExists(id)) {
      const book = setBook(id);
      book.title = updatedTitle;
      book.author = updatedAuthor;
      book.pages = updatedPages;
      book.img_url = updatedImgUrl;
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
    setBook,
  };
})();

// ends

const cardTemplate = ({ title, author, pages, img_url, read }) =>
  `<img src="${img_url}" alt="${title}" />
    <h2>${title}</h2>
    <p>By ${author}</p>
    <p>${pages}pages</p>
    <label>
      <input type="checkbox" class="checkbox" ${read ? "checked" : ""} data-action="toggle">
    </label>
    <button type="button" data-action="showEditModal">Edit</button>
    <button type="button" data-action="delete">Delete</button>`;

const createBookCard = (book) => {
  const card = document.createElement('article');
  card.classList.add('book-card');
  card.dataset.id = book.id;
  card.innerHTML = cardTemplate(book);
  return card;
}

const renderBooks = (books) => {
  const fragment = document.createDocumentFragment();
  books.forEach(book => fragment.appendChild(createBookCard(book)));
  document.querySelector('main').appendChild(fragment);
};

const appendBook = (book) => {
  document.querySelector('main').appendChild(createBookCard(book));
};

renderBooks(libraryDB.books);

// dialog
const btnAddNewBook = document.getElementById("showAddModal");
const editDialog = document.getElementById("modalDialog");
const dCnl = document.getElementById("cancelBtn");

// "Show the dialog" button opens the <dialog> modally
const displayDialog = (title, action) => {
  const dialog = document.getElementById("modalDialog");
  const h2 = dialog.querySelector("h2");
  const submitBtn = dialog.querySelector("form button[type='submit']");
  h2.textContent = title;
  submitBtn.dataset.action = action;
  dialog.showModal();
};

// populate the form with the book details
const populateForm = (book) => {
  const form = document.getElementById("modalForm");
  const id = form.querySelector("input[name='bookId']");
  const title = form.querySelector("input[name='title']");
  const author = form.querySelector("input[name='author']");
  const pages = form.querySelector("input[name='pages']");
  const img_url = form.querySelector("input[name='img_url']");
  id.value = book.id;
  title.value = book.title;
  author.value = book.author;
  pages.value = book.pages;
  img_url.value = book.img_url;
};

btnAddNewBook.addEventListener("click", () =>
  displayDialog("Add New Book", "addNew")
);

const handleAddBook = ({ title, author, pages, img_url }) => {
  const dialog = document.getElementById("modalDialog");
  const form = dialog.querySelector("form");
  const newBook = createBook({ title, author, pages, img_url });
  const result = libraryDB.addBook(newBook);
  if (result.success) {
    appendBook(newBook);
    form.reset();
    dialog.close();
  } else {
    alert(result.message);
  }
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
      const book = libraryDB.setBook(id);
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

const handleModalFormClick = (e) => {
  e.preventDefault();
  const action = e.target.dataset.action;
  const dialog = e.target.closest('dialog');
  const form = e.target.closest('form');
  const formData = new FormData(form);
  const bookData = Object.fromEntries(formData.entries())
  switch (action) {
    case "addNew":
      handleAddBook(bookData);
      break;
    case "updateDetails":
      // {id, updatedTitle, updatedAuthor, updatedPages, updatedImgUrl}
      console.log("update book");
      break;
    case "cancel":
      form.reset();
      dialog.close();
      break;

    default:
      // no action
      break;
  }
};

const cardContainer = document.querySelector('main');
cardContainer.addEventListener('click', handleMainClick);
cardContainer.addEventListener('change', handleChangeCheckbox);
document.getElementById('modalForm').addEventListener('click', handleModalFormClick);
