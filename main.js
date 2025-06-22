document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bookForm");
    const title = document.getElementById("bookFormTitle");
    const author = document.getElementById("bookFormAuthor");
    const year = document.getElementById("bookFormYear");
    const status = document.getElementById("bookFormIsComplete");
    const incomplete = document.getElementById("incompleteBookList");
    const complete = document.getElementById("completeBookList");

    let books = JSON.parse(localStorage.getItem("books")) || [];
    let editingBookId = null; // Untuk menyimpan ID buku yang sedang diedit

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (editingBookId) {
            updateBook(editingBookId);
        } else {
            addBook();
        }
    });

    function addBook() {
        if (!title.value || !author.value || !year.value) {
            alert("Harap isi semua bidang.");
            return;
        }

        const yearValue = Number(year.value);
        if (isNaN(yearValue) || yearValue < 1900 || yearValue > new Date().getFullYear()) {
            alert("Masukkan tahun yang valid.");
            return;
        }

        const book = {
            id: +new Date(),
            title: title.value,
            author: author.value,
            year: yearValue,
            isComplete: status.checked,
        };

        books.push(book);
        saveBooks();
        renderBooks();
        alert("Buku berhasil ditambahkan!");
        form.reset();
    }

    function updateBook(bookId) {
        const book = books.find((b) => b.id === bookId);
        if (book) {
            book.title = title.value;
            book.author = author.value;
            book.year = Number(year.value);
            book.isComplete = status.checked;
        }

        saveBooks();
        renderBooks();
        alert("Buku berhasil diperbarui!");
        form.reset();
        editingBookId = null; // Reset mode edit
    }

    function renderBooks() {
        incomplete.innerHTML = "";
        complete.innerHTML = "";

        books.forEach((book) => {
            const bookElement = createBookElement(book);
            if (book.isComplete) {
                complete.appendChild(bookElement);
            } else {
                incomplete.appendChild(bookElement);
            }
        });
    }

    function createBookElement(book) {
        const bookContainer = document.createElement("div");
        bookContainer.setAttribute("data-bookid", book.id);
        bookContainer.setAttribute("data-testid", "bookItem");

        bookContainer.innerHTML = `
            <h3 data-testid="bookItemTitle">${book.title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
            <p data-testid="bookItemYear">Tahun: ${book.year}</p>
            <div>
                <button data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum selesai" : "Selesai dibaca"}</button>
                <button data-testid="bookItemDeleteButton">Hapus Buku</button>
                <button data-testid="bookItemEditButton">Edit Buku</button>
            </div>
        `;

        bookContainer.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener("click", () => toggleBookStatus(book.id));
        bookContainer.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener("click", () => deleteBook(book.id));
        bookContainer.querySelector('[data-testid="bookItemEditButton"]').addEventListener("click", () => editBook(book.id));

        return bookContainer;
    }

    function toggleBookStatus(bookId) {
        const book = books.find((b) => b.id === bookId);
        if (book) {
            book.isComplete = !book.isComplete;
            saveBooks();
            renderBooks();
        }
    }

    function deleteBook(bookId) {
        const confirmDelete = confirm("Apakah Anda yakin ingin menghapus buku ini?");
        if (!confirmDelete) return;
        books = books.filter((b) => b.id !== bookId);
        saveBooks();
        renderBooks();
    }

    function editBook(bookId) {
        const book = books.find((b) => b.id === bookId);
        if (book) {
            title.value = book.title;
            author.value = book.author;
            year.value = book.year;
            status.checked = book.isComplete;

            editingBookId = bookId; // Simpan ID buku yang sedang diedit
        }
    }

    function saveBooks() {
        localStorage.setItem("books", JSON.stringify(books));
    }

    renderBooks();
});
