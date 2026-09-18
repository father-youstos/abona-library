const API_URL = "https://script.google.com/macros/s/AKfycby77eXDZZWwaX7xZwqf_o1hDcAyT-43GpnabpNQHicutlU0wF1putVvOg6StLG_-fBQuQ/exec";

const grid = document.getElementById('grid');
const q = document.getElementById('q');
const filters = document.getElementById('filters');
const count = document.getElementById('count');
const empty = document.getElementById('empty');

let BOOKS = [];
let active = 'الكل';

function setupFilters() {
  filters.innerHTML = '';

  const cats = [
    'الكل',
    ...new Set(BOOKS.map(b => b.category || 'الكتب'))
  ];

  cats.forEach(c => {
    const button = document.createElement('button');

    button.textContent = c;
    button.className = c === active ? 'active' : '';

    button.onclick = () => {
      active = c;

      [...filters.children].forEach(b => {
        b.classList.toggle(
          'active',
          b.textContent === c
        );
      });

      render();
    };

    filters.appendChild(button);
  });
}

function card(b) {

  const view =
    b.viewUrl ||
    `https://drive.google.com/file/d/${b.id}/view`;

  const download =
    b.downloadUrl ||
    `https://drive.google.com/uc?export=download&id=${b.id}`;

  const thumbnail =
    b.coverUrl ||
    `https://drive.google.com/thumbnail?id=${b.id}&sz=w800`;

  return `
    <article class="card">

      <div class="cover">

        <img
          loading="lazy"
          src="${thumbnail}"
          alt="غلاف ${b.title}"
        >

        <span class="badge">
          ${b.category || 'الكتب'}
        </span>

      </div>

      <div class="info">

        <h2>${b.title}</h2>

        <p class="author">
          القمص يسطس جوزيف
        </p>

        <div class="actions">

          <a
            class="btn primary"
            target="_blank"
            rel="noopener"
            href="${view}"
          >
            قراءة الكتاب
          </a>

          <a
            class="btn"
            href="${download}"
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

  const list = BOOKS.filter(b => {

    const correctCategory =
      active === 'الكل' ||
      (b.category || 'الكتب') === active;

    const correctSearch =
      b.title
        .toLowerCase()
        .includes(term);

    return correctCategory && correctSearch;
  });

  grid.innerHTML =
    list.map(card).join('');

  count.textContent =
    list.length;

  empty.hidden =
    !!list.length;
}

async function loadBooks() {

  count.textContent = '...';

  try {

    const response =
      await fetch(
        API_URL,
        {
          cache: 'no-store'
        }
      );

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    const data =
      await response.json();

    if (
      !data.success ||
      !Array.isArray(data.books)
    ) {
      throw new Error(
        'Invalid API response'
      );
    }

    BOOKS =
      data.books.map(b => ({
        ...b,
        category: 'الكتب'
      }));

    setupFilters();

    render();

  }

  catch (error) {

    console.error(
      'تعذر تحميل الكتب من Google Drive:',
      error
    );

    grid.innerHTML = '';

    count.textContent = '0';

    empty.hidden = false;

    empty.textContent =
      'تعذر تحميل الكتب حاليًا. حاول تحديث الصفحة بعد قليل.';
  }
}

q.addEventListener(
  'input',
  render
);

loadBooks();
