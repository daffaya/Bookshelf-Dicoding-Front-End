document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  const searchBookForm = document.getElementById("searchBook");
  const incompleteBookshelf = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelf = document.getElementById("completeBookshelfList");

  function addBook(event) {
    event.preventDefault();

    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = parseInt(document.getElementById("inputBookYear").value);
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    const id = +new Date();

    const newBook = {
      id: id,
      title: title,
      author: author,
      year: year,
      isComplete: isComplete,
    };

    saveBook(newBook);
    inputBookForm.reset();
    renderBooks();
  }

  function saveBook(book) {
    const existingBooks = JSON.parse(localStorage.getItem("books")) || [];
    existingBooks.push(book);
    localStorage.setItem("books", JSON.stringify(existingBooks));
  }

  function getBooks() {
    return JSON.parse(localStorage.getItem("books")) || [];
  }

  function renderBooks() {
    const books = getBooks();
    incompleteBookshelf.innerHTML = "";
    completeBookshelf.innerHTML = "";

    books.forEach(function (book) {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookshelf.appendChild(bookElement);
      } else {
        incompleteBookshelf.appendChild(bookElement);
      }
    });
  }

  function createBookElement(book) {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = "Penulis: " + book.author;

    const year = document.createElement("p");
    year.textContent = "Tahun: " + book.year;

    const actionDiv = document.createElement("div");
    actionDiv.classList.add("action");

    const moveButton = document.createElement("button");
    moveButton.textContent = book.isComplete
      ? "Belum selesai dibaca"
      : "Selesai dibaca";
    moveButton.classList.add(book.isComplete ? "green" : "red");
    moveButton.addEventListener("click", function () {
      toggleCompletion(book.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Hapus buku";
    deleteButton.classList.add("red");
    deleteButton.addEventListener("click", function () {
      showDeleteConfirmation(book.id);
    });

    actionDiv.appendChild(moveButton);
    actionDiv.appendChild(deleteButton);

    bookItem.appendChild(title);
    bookItem.appendChild(author);
    bookItem.appendChild(year);
    bookItem.appendChild(actionDiv);

    return bookItem;
  }

  function toggleCompletion(bookId) {
    const books = getBooks();
    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
      books[index].isComplete = !books[index].isComplete;
      localStorage.setItem("books", JSON.stringify(books));
      renderBooks();
    }
  }

  function deleteBook(bookId) {
    const books = getBooks();
    const updatedBooks = books.filter((book) => book.id !== bookId);
    localStorage.setItem("books", JSON.stringify(updatedBooks));
    renderBooks();
  }

  function showDeleteConfirmation(bookId) {
    if (confirm("Are you sure you want to delete this book?")) {
      deleteBook(bookId);
    }
  }

  inputBookForm.addEventListener("submit", addBook);

  // Search functionality
  searchBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchTitle = document
      .getElementById("searchBookTitle")
      .value.trim()
      .toLowerCase();
    const books = getBooks();
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchTitle)
    );
    renderFilteredBooks(filteredBooks);
  });

  function renderFilteredBooks(filteredBooks) {
    incompleteBookshelf.innerHTML = "";
    completeBookshelf.innerHTML = "";
    filteredBooks.forEach(function (book) {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookshelf.appendChild(bookElement);
      } else {
        incompleteBookshelf.appendChild(bookElement);
      }
    });
  }

  renderBooks();
});
