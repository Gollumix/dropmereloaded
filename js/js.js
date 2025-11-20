  const hamburger = document.getElementById("hamburger");
  const sidebar = document.querySelector(".sidebar");
  const content = document.querySelector(".content");

  // Otwórz / zamknij hamburgerem
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  // Klik poza menu = zamknięcie
  content.addEventListener("click", () => {
    if (sidebar.classList.contains("active")) {
      sidebar.classList.remove("active");
    }
  });