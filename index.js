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

  const updateBook = (id, updatedTitle, updatedAuthor, updatedPages, updatedImgUrl, updatedRead) => {
    if (bookExists(id)) {
      const book = setBook(id);
      book.title = updatedTitle;
      book.author = updatedAuthor;
      book.pages = updatedPages;
      book.img_url = updatedImgUrl;
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

console.log(libraryDB.books);
console.log(libraryDB.addBook({id: 'abc', title:'gjg', author: 'hgfhf', pages: 200, read: false}));
console.log(libraryDB.books);
console.log(libraryDB.removeBook('abc'));
console.log(libraryDB.books);

const cardTemplate = ({ title, author, pages, img_url, read }) =>
  `<img src="${img_url}" alt="${title}" />
    <h2>${title}</h2>
    <p>By ${author}</p>
    <p>${pages}pages</p>
    <button type="button" data-action="toggle">${read ? "Read" : "Not Read"}</button>
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
const addBook = document.getElementById("showAddModal");
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

addBook.addEventListener("click", () =>
  displayDialog("Add New Book", "addNew")
);

// editDialog.addEventListener("close", (e) => "closed");

const handleSubmission = (e) => {
  e.preventDefault();
  
  const bookData = new FormData(e.target);
  const { title, author, pages, img_url } = Object.fromEntries(bookData.entries());
  console.log(title, author, pages, img_url);
  const book = createBook({ title, author, pages, img_url });
  const result = libraryDB.addBook(book);
  if (result.success) {
    appendBook(book);
    editDialog.close();
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
      displayDialog("Edit Book Details", "updateDetails");
      break;
    case "toggle":
      result = libraryDB.updateReadStatus(id);
      if (result.success) {
        e.target.textContent = e.target.textContent === "Read" ? "Not Read" : "Read";
      }
      break;

    default:
      // no action
      break;
  }
};

const handleModalFormClick = (e) => {
  const action = e.target.dataset.action;
  const dialog = e.target.closest('dialog');
  switch (action) {
    case "addNew":
      console.log('add new');;
      break;
    case "updateDetails":
      console.log("update book");
      break;
    case "cancel":
      e.preventDefault();
      console.log("cancel");
      dialog.close();
      break;

    default:
      // no action
      break;
  }
};

document.querySelector('main').addEventListener('click', handleMainClick);
document.getElementById('modalForm').addEventListener('click', handleModalFormClick);
