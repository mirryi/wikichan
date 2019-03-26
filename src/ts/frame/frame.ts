const accordions = Array.from(document.getElementsByClassName("ext-links"));
accordions.forEach(a => {
    a.addEventListener("mousedown", function() {
        this.classList.toggle("active");
        const panel = this.nextElementSibling;
        panel.style.display = panel.style.display === "block" ? "none" : "block";
    });
});