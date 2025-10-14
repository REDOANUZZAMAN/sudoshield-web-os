(function(){
  function updateResponsiveClass(){
    if (window.innerWidth <= 800 || window.innerHeight <= 600) {
      document.documentElement.classList.add('mobile');
      document.body.classList.add('mobile');
    } else {
      document.documentElement.classList.remove('mobile');
      document.body.classList.remove('mobile');
    }
  }
  window.addEventListener('resize', () => {
    // throttle
    if (window.responsiveRaf) cancelAnimationFrame(window.responsiveRaf);
    window.responsiveRaf = requestAnimationFrame(updateResponsiveClass);
  });
  updateResponsiveClass();
})();