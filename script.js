// Select DOM elements for list and grid views, pagination, search input, and sorting options
const listView = document.querySelector(".list-container");
const gridView = document.querySelector(".grid-container");
const pageDisplay = document.querySelector(".page");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const searchInput = document.querySelector(".search-input");
const sortSelect = document.querySelector(".sort-select");

// Array to store fetched books and pagination variables
let fetchedBooks = [];
let page = 1; // Current page number
const limit = 10; // Number of books per page

// Function to toggle between list and grid view
function toggleView() {
  const body = document.body;
  const btn = document.querySelector(".header-btn");

  // Toggle the 'list-view' class on the body
  body.classList.toggle("list-view");

  // Update the search results based on the current view
  handleInputSearch();

  // Change button text based on the current view
  if (body.classList.contains("list-view")) {
    btn.textContent = "Switch to Grid";
  } else {
    btn.textContent = "Switch to List";
  }
}

// Function to fetch books from the API
async function fetchBooks(currentPage = 1) {
  const url = `https://api.freeapi.app/api/v1/public/books?page=${currentPage}&limit=${limit}&inc=kind%252Cid%252Cetag%252CvolumeInfo&query=tech`;

  try {
    const response = await fetch(url); // Fetch data from API
    const data = await response.json(); // Parse JSON response
    fetchedBooks = data.data.data; // Store fetched books in the array

    // Check if data exists and has items
    if (!data.data || !data.data.data || data.data.data.length === 0) {
      // Prevent going to an empty page
      return false;
    }

    // Update page display with current page number
    pageDisplay.textContent = currentPage;

    // Clear previous content in both views
    listView.innerHTML = "";
    gridView.innerHTML = "";

    // Sort books based on selected criteria
    sortBooks();

    // Render list view of books
    listView.innerHTML = fetchedBooks
      .map(
        (book) => `
        <a href=${book.volumeInfo.infoLink} target="_blank">
          <div class="list-item">
            <img
              src="${
                book.volumeInfo.imageLinks?.thumbnail || "placeholder.jpg"
              }"
              alt="thumbnail"
              width="100"
              height="150"
              onerror="this.src='placeholder.jpg'" <!-- Fallback image -->
            />
            <div class="list-content">
              <p style="font-size: 20px; font-weight: bold">${
                book.volumeInfo.title || "Unknown Title"
              }</p>
              <p>${
                book.volumeInfo.authors
                  ? book.volumeInfo.authors.join(", ")
                  : "Unknown Author"
              }</p>
              <p>${book.volumeInfo.publisher || "Unknown Publisher"}</p>
              <p>${
                book.volumeInfo.publishedDate
                  ? new Date(book.volumeInfo.publishedDate).toLocaleDateString()
                  : "Unknown Date"
              }</p>
            </div>
          </div>
        </a>
      `
      )
      .join("");

    // Render grid view of books
    gridView.innerHTML = fetchedBooks
      .map(
        (book) => `
        <a href=${book.volumeInfo.infoLink} target="_blank">
          <div class="grid-item">
            <img
              src="${
                book.volumeInfo.imageLinks?.thumbnail || "placeholder.jpg"
              }"
              alt="thumbnail"
              class="grid-img"
              height="200"
              width="150"
              onerror="this.src='placeholder.jpg'" <!-- Fallback image -->
            />
            <p class="grid-title">${
              book.volumeInfo.title || "Unknown Title"
            }</p>
            <p class="grid-author">${
              book.volumeInfo.authors
                ? book.volumeInfo.authors.join(", ")
                : "Unknown Author"
            }</p>
            <p>${book.volumeInfo.publisher || "Unknown Publisher"}</p>
            <p>${
              book.volumeInfo.publishedDate
                ? new Date(book.volumeInfo.publishedDate).toLocaleDateString()
                : "Unknown Date"
            }</p>
          </div>
        </a>
      `
      )
      .join("");

    return true; // Indicate successful fetch
  } catch (error) {
    console.error("Error fetching books:", error); // Log any errors encountered during fetch
    return false; // Indicate failure to fetch data
  }
}

// Function to navigate to the previous page of results
async function prevPage() {
  if (page > 1) {
    // Ensure we are not on the first page
    const success = await fetchBooks(page - 1); // Fetch previous page of books
    if (success) {
      page--; // Decrement the page number if successful
    }
  }
}

// Function to navigate to the next page of results
async function nextPage() {
  const success = await fetchBooks(page + 1); // Fetch next page of books
  if (success) {
    page++; // Increment the page number if successful
  }
}

// Function to handle searching through books based on user input
function handleInputSearch() {
  const searchValue = searchInput.value.toLowerCase(); // Get search input value

  // Filter books based on title or author matching search value
  const filteredBooks = fetchedBooks.filter(
    (book) =>
      book.volumeInfo.title.toLowerCase().includes(searchValue) ||
      book.volumeInfo.authors.join(", ").toLowerCase().includes(searchValue)
  );

  const body = document.body;

  if (body.classList.contains("list-view")) {
    // Render filtered results in list view if in list mode
    listView.innerHTML = filteredBooks
      .map(
        (book) => `
        <a href=${book.volumeInfo.infoLink} target="_blank">
          <div class="list-item">
            <img src="${
              book.volumeInfo.imageLinks?.thumbnail || "placeholder.jpg"
            }" alt="thumbnail" width="100" height="150" onerror="this.src='placeholder.jpg'" />
            <div class="list-content">
              <p style="font-size: 20px; font-weight: bold">${
                book.volumeInfo.title || "Unknown Title"
              }</p>
              <p>${
                book.volumeInfo.authors
                  ? book.volumeInfo.authors.join(", ")
                  : "Unknown Author"
              }</p>
              <p>${book.volumeInfo.publisher || "Unknown Publisher"}</p>
              <p>${
                book.volumeInfo.publishedDate
                  ? new Date(book.volumeInfo.publishedDate).toLocaleDateString()
                  : "Unknown Date"
              }</p>
            </div>
          </div>
        </a>
      `
      )
      .join("");
  } else {
    // Render filtered results in grid view if in grid mode
    gridView.innerHTML = filteredBooks
      .map(
        (book) => `
        <a href=${book.volumeInfo.infoLink} target="_blank">
          <div class="grid-item">
            <img src="${
              book.volumeInfo.imageLinks?.thumbnail || "placeholder.jpg"
            }" alt="thumbnail" class="grid-img" height="200" width="150" onerror="this.src='placeholder.jpg'" />
            <p class="grid-title">${
              book.volumeInfo.title || "Unknown Title"
            }</p>
            <p class="grid-author">${
              book.volumeInfo.authors
                ? book.volumeInfo.authors.join(", ")
                : "Unknown Author"
            }</p>
            <p>${book.volumeInfo.publisher || "Unknown Publisher"}</p>
            <p>${
              book.volumeInfo.publishedDate
                ? new Date(book.volumeInfo.publishedDate).toLocaleDateString()
                : "Unknown Date"
            }</p>
          </div>
        </a>
      `
      )
      .join("");
  }
}

// Add event listener for input changes in the search box to trigger searching functionality
searchInput.addEventListener("input", handleInputSearch);

// Function to sort books based on selected criteria (title or date)
function sortBooks() {
  const sortBy = sortSelect.value; // Get selected sorting option

  if (sortBy === "title") {
    fetchedBooks.sort((a, b) => {
      const titleA = a.volumeInfo.title.toLowerCase();
      const titleB = b.volumeInfo.title.toLowerCase();
      return titleA.localeCompare(titleB); // Sort alphabetically by title
    });
  } else if (sortBy === "date") {
    fetchedBooks.sort((a, b) => {
      const dateA = new Date(a.volumeInfo.publishedDate);
      const dateB = new Date(b.volumeInfo.publishedDate);
      return dateA - dateB; // Sort by published date in ascending order
    });
  }

  // Re-render the current view after sorting is applied
  handleInputSearch();
}

// Initial fetch of books when the application loads
fetchBooks(page);
