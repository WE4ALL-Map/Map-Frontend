let filterContentList = document.querySelectorAll(".filter-content")
let expandContentButtons = document.querySelectorAll(".expand-filter-button")
document.querySelectorAll(".filter-header").forEach(
    (e, i) => {
        e.addEventListener("click", () => {
                expandContentButtons[i].classList.toggle("bx-plus")
                expandContentButtons[i].classList.toggle("bx-minus")
                let content = filterContentList[i]
                if (content.style.maxHeight){
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            }
        )
    }
)
let menu = document.getElementsByClassName("filter-menu")[0]
let toggle = document.getElementsByClassName("toggle-button") [0]

toggle.addEventListener("click", () => {
    menu.classList.toggle("active")
    toggle.classList.toggle("bx-menu")
    toggle.classList.toggle("bx-chevron-right")
})