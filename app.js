const API_URL =
  "https://script.google.com/macros/s/AKfycby77eXDZZWwaX7xZwqf_o1hDcAyT-43GpnabpNQHicutlU0wF1putVvOg6StLG_-fBQuQ/exec";

const grid =
  document.getElementById("grid");

const q =
  document.getElementById("q");

const filters =
  document.getElementById("filters");

const count =
  document.getElementById("count");

const empty =
  document.getElementById("empty");


let BOOKS = [];

let active = "الكل";


function setupFilters() {

  filters.innerHTML = "";

  const cats = [
    "الكل",
    ...new Set(
      BOOKS.map(
        b => b.category || "الكتب"
      )
    )
  ];

  cats.forEach(c => {

    const button =
      document.createElement("button");

    button.textContent = c;

    button.className =
      c === active
        ? "active"
        : "";

    button.onclick = () => {

      active = c;

      [...filters.children]
        .forEach(b => {

          b.classList.toggle(
            "active",
            b.textContent === c
          );

        });

      render();
    };

    filters.appendChild(button);

  });
}


function card(b) {

  return `
    <article class="card">

      <div class="cover">

        <img
          loading="lazy"
          src="${b.coverUrl}"
          alt="غلاف ${b.title}"
        >

        <span class="badge">
          ${b.category || "الكتب"}
        </span>

      </div>

      <div class="info">

        <h2>
          ${b.title}
        </h2>

        <p class="author">
          القمص يسطس جوزيف
        </p>

        <div class="actions">

          <a
            class="btn primary"
            target="_blank"
            rel="noopener"
            href="${b.viewUrl}"
          >
            قراءة الكتاب
          </a>

          <a
            class="btn"
            href="${b.downloadUrl}"
          >
            تحميل PDF
          </a>

        </div>

      </div>

    </article>
  `;
}


function render() {

  const term =
    q.value
      .trim()
      .toLowerCase();

  const list =
    BOOKS.filter(b => {

      const categoryOK =
        active === "الكل" ||
        (b.category || "الكتب")
          === active;

      const searchOK =
        b.title
          .toLowerCase()
          .includes(term);

      return (
        categoryOK &&
        searchOK
      );

    });


  grid.innerHTML =
    list.map(card).join("");


  count.textContent =
    list.length;


  empty.hidden =
    list.length > 0;
}


function receiveBooks(data) {

  if (
    !data ||
    !data.success ||
    !Array.isArray(data.books)
  ) {

    showError();
    return;
  }


  BOOKS =
    data.books.map(b => ({
      ...b,
      category: "الكتب"
    }));


  setupFilters();

  render();
}


function showError() {

  count.textContent = "0";

  grid.innerHTML = "";

  empty.hidden = false;

  empty.textContent =
    "تعذر تحميل الكتب حاليًا.";
}


function loadBooks() {

  count.textContent = "...";


  const oldScript =
    document.getElementById(
      "drive-api-script"
    );


  if (oldScript) {
    oldScript.remove();
  }


  const script =
    document.createElement("script");


  script.id =
    "drive-api-script";


  script.src =
    API_URL +
    "?callback=receiveBooks&t=" +
    Date.now();


  script.onerror =
    showError;


  document.body.appendChild(
    script
  );
}


q.addEventListener(
  "input",
  render
);


loadBooks();
