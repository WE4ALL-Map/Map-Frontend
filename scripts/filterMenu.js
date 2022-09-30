const filterMenu = document.getElementById("filter-menu");
const toggleMenuOpenButton = document.getElementById("toggle-menu-open-button");

const filterHeaderList = document.getElementsByClassName("filter-header")

const onToggleMenuOpenButtonClick = () => {
    filterMenu.classList.toggle("active")

    toggleMenuOpenButton.classList.toggle("bx-menu")
    toggleMenuOpenButton.classList.toggle("bx-chevron-right")
}

const onFilterHeaderClick = (filterHeader) => {
    const filterContent = filterHeader.nextElementSibling;

    const expandFilterButton = filterHeader.querySelector(".expand-filter-button")

    switchExpandFilterButtonIcon(expandFilterButton)

    expandFilterContent(filterContent)
}

const expandFilterContent = (filterContent) => {
    if (filterContent.style.maxHeight) {
        filterContent.style.maxHeight = null;
    } else {
        filterContent.style.maxHeight = filterContent.scrollHeight + "px";
    }
    filterContent.classList.toggle("expanded");
}

const switchExpandFilterButtonIcon = (expandFilterButton) => {
    expandFilterButton.classList.toggle("bx-plus")
    expandFilterButton.classList.toggle("bx-minus")
}

const setEventListeners = () => {
    Array.from(filterHeaderList).forEach((filterHeader) => {
            filterHeader.addEventListener("click", onFilterHeaderClick.bind(null, filterHeader));
        }
    )
    toggleMenuOpenButton.addEventListener("click", onToggleMenuOpenButtonClick);
}

setEventListeners();
