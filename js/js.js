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

        (function(){
        window.onload = function () {
          document.getElementById('cookie-popup-dismiss-btn').addEventListener('click', dismissCookiePopup);
          
          var shouldShowPopup = localStorage.getItem('cookiePopupConsumed') !== '1';
          if (shouldShowPopup) {
            setTimeout(function () {
              document.getElementById('cookie-popup').className += ' is-visible';
            }, 1000);
          }
        }
    
        function dismissCookiePopup() {
          localStorage.setItem('cookiePopupConsumed', '1');
          document.getElementById('cookie-popup').className = '';
        }
      })();