const filterMenu = document.getElementById("filter-menu");
const toggleMenuButton = document.getElementById("toggle-menu-button");

const onToggleMenuButtonClicked = () => {
    filterMenu.classList.toggle("active");

    toggleMenuButton.classList.toggle("bx-menu");
    toggleMenuButton.classList.toggle("bx-chevron-right");
};

const setEventListeners = () => {
    toggleMenuButton.addEventListener("click", onToggleMenuButtonClicked);
};

setEventListeners();
