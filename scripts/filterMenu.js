const filterMenu = document.getElementById("filter-menu");
const toggleMenuButton = document.getElementById("toggle-menu-button");

const filterHeaderList = document.getElementsByClassName("filter-header");

const onToggleMenuButtonClicked = () => {
    filterMenu.classList.toggle("active");

    toggleMenuButton.classList.toggle("bx-menu");
    toggleMenuButton.classList.toggle("bx-chevron-right");
};

const onFilterHeaderClick = (filterHeader) => {
    const filterContent = filterHeader.nextElementSibling;

    const expandFilterButton = filterHeader.querySelector(".expand-filter-button");

    toggleMenuButtonIcon(expandFilterButton);

    expandFilterContent(filterContent);
};

const expandFilterContent = (filterContent) => {
    if (filterContent.style.maxHeight) {
        filterContent.style.maxHeight = null;
    } else {
        filterContent.style.maxHeight = filterContent.scrollHeight + "px";
    }

    filterContent.classList.toggle("expanded");
};

const toggleMenuButtonIcon = (expandFilterButton) => {
    expandFilterButton.classList.toggle("bx-plus");
    expandFilterButton.classList.toggle("bx-minus");
};

const setEventListeners = () => {
    for (let filterHeader of filterHeaderList) {
        filterHeader.addEventListener("click", onFilterHeaderClick.bind(null, filterHeader));
    }

    toggleMenuButton.addEventListener("click", onToggleMenuButtonClicked);
};

setEventListeners();
