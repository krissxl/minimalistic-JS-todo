$(function () {
    const toDo = localStorage.getItem("toDoList") ? JSON.parse(localStorage.getItem("toDoList")) : [];
    const input = $(".bottom-bar__input");
    const toDoListElem = $(".todo-list");

    refreshToDo();

    toDoListElem.height(window.innerHeight - 130);
    input.width($(window).width() - 20 - 110);

    window.addEventListener("resize", function f() {
        toDoListElem.height(window.innerHeight - 130);
        input.width($(window).width() - 20 - 110);
        $(".edit__input").each((i, elem) => elem.style.width = `${window.innerWidth - 100 - 55}px`)
    });

    function refreshToDo() {
        toDoListElem.html("");
        const currentColor = $("body").data("colorScheme");
        let i = 0;
        for (let obj of toDo) {
            let elem = document.createElement("div");
            elem.classList.add("todo-container");
            elem.dataset.number = String(i);
            elem.dataset.colorScheme = currentColor;
            elem.innerHTML =    `<label class="checkbox-container" data-color-scheme="${currentColor}">${obj.text}\n
                                    <input data-number="${i}" type="checkbox" ${obj.checked ? "checked" : ""}>\n
                                    <span class="checkmark" data-color-scheme="${currentColor}"></span>\n
                                </label>
                                <input class="edit__input" type="text" value="" data-color-scheme="${currentColor}" style="width: ${window.innerWidth - 100 - 55}px" hidden>
                                <ul>
                                    <li class="edit" data-color-scheme="${currentColor}"></li>
                                    <li class="delete" data-color-scheme="${currentColor}"></li>
                                </ul>`;
            toDoListElem[0].insertAdjacentElement("afterbegin", elem);
            i++;
        }
    }

    toDoListElem.click(function (event) {
        const target = $(event.target)
        if (target.is("input") && target.attr("type") === "checkbox") setCheckboxState(target);
        else if (target.is("li") && target.hasClass("delete")) deleteToDo(target);
        else if (target.is("li") && target.hasClass("edit")) updateToDo(target);
        else if (target.is("li") && target.hasClass("ready")) updateToDoReady(target);
    });

    function setCheckboxState(target) {
        toDo[+target.data("number")].checked = target.prop("checked");
        localStorage.setItem("toDoList", JSON.stringify(toDo));
    }

    function deleteToDo(target) {
        const number = +target.parents(".todo-container").data("number");
        toDo.splice(number, 1);
        localStorage.setItem("toDoList", JSON.stringify(toDo));
        refreshToDo();
    }

    function updateToDo(target) {
        const editButton =  target;
        const toDoText = target.parents(".todo-container").children(".checkbox-container");
        const editInput = target.parents(".todo-container").children(".edit__input");
        editInput.val(toDoText[0].textContent.trim());
        editInput.show();
        editInput.focus();
        editButton.removeClass("edit");
        editButton.addClass("ready");
        editInput.keydown(function(keyEvent) {
            if (keyEvent.key === "Enter") {
                updateToDoReady(target)
            }
        });
    }

    function updateToDoReady(target) {
        const editButton =  target;
        const toDoText = target.parents(".todo-container").children(".checkbox-container")[0].firstChild;
        const editInput = target.parents(".todo-container").children(".edit__input");
        const toDoNumber = target.parents(".todo-container").data("number");
        toDoText.textContent = editInput.val();
        toDo[+toDoNumber].text = editInput.val();
        localStorage.setItem("toDoList", JSON.stringify(toDo));
        editButton.removeClass("ready");
        editButton.addClass("edit");
        editInput.hide();
    }

    $(".cancel").click(function () {
        input.val("");
        $(".cancel").css("display", "none");
    });

    $(".bottom-bar__btn").click(addToDo);

    function addToDo() {
        if (input.val()) {
            toDo.push({text: input.val(), checked: false})
            localStorage.setItem("toDoList", JSON.stringify(toDo));
            input.val("");
            $(".cancel").css("display", "none");
            input[0].placeholder = "What to do?"
            refreshToDo();
        } else {
            function endAnim(event) {
                event.target.classList.remove("wrongAnim")
            }
            input.addClass("wrongAnim");
            input[0].placeholder = "Enter ToDo"
            input[0].addEventListener("animationend", endAnim)
        }
    }

    input[0].addEventListener("input", function () {
        if (input.val()) {
            $(".cancel").css("display", "block");
        } else {
            $(".cancel").css("display", "none");
        }
    });

    input.keydown(function (event) {
        if (event.key === "Enter") addToDo();
    });

    $(".left-menu__btn").click(function () {
        const leftButton = $(".left-menu__btn");
        if (leftButton[0].dataset.active === "false") {
            $(".wrapper").css("left", "+=100px");
            $(".left-menu__main").css("left", "+=100px");
            leftButton.css("left", "+=100px");
            leftButton[0].dataset.active = "true";
        } else {
            $(".wrapper").css("left", "-=100px");
            $(".left-menu__main").css("left", "-=100px");
            leftButton.css("left", "-=100px");
            leftButton[0].dataset.active = "false";
        }
    });

    $('.color-scheme__btn').click(function (event) {
        if (event.target.className === "color-scheme__btn") {
            if (event.target.dataset.active === "false") {
                event.target.dataset.active = "true";
            } else {
                event.target.dataset.active = "false";
            }
        }
    });

    $('.top-bar__sort-btn').click(function (event) {
        if (event.target.className === "top-bar__sort-btn") {
            if (event.target.dataset.active === "false") {
                event.target.dataset.active = "true";
            } else {
                event.target.dataset.active = "false";
            }
        }
    });

    $(".sort_by-name").click(function () {
        const sortBtn = $(".sort_by-name")[0]
        if (sortBtn.dataset.direction === "down") {
            toDo.sort(((a, b) => b.text.localeCompare(a.text)));
            sortBtn.dataset.direction = "up"
        } else {
            toDo.sort(((a, b) => a.text.localeCompare(b.text)));
            sortBtn.dataset.direction = "down"
        }
        localStorage.setItem("toDoList", JSON.stringify(toDo));
        refreshToDo();
    });

    document.addEventListener("click", function (event) {
        const button = $(".color-scheme__btn")[0];
        if (!Object.entries(event.composedPath()).map(arr => arr[1]).includes(button)) {
            button.dataset.active = "false";
        }
    });

    $(".color").click(function (event) {
        const color = event.target.classList[0];
        const currentColor = document.body.dataset.colorScheme;
        $('.color-active')[0].classList.remove("color-active");
        event.target.classList.add("color-active");
        function transEnd(event) {
            event.target.style.transition = "";
            event.target.removeEventListener("transitionend", transEnd)
        }
        for (const elem of document.querySelectorAll("[data-color-scheme]")) {
            if (color !== currentColor) {
                elem.dataset.colorScheme = color;
                elem.style.transition = "background-color 0.1s, color 0.15s, border 0.15s";
                elem.addEventListener("transitionend", transEnd)
            }
        }
    });

    window.addEventListener("unload", function () {
        localStorage.setItem("colorScheme", document.body.dataset.colorScheme);
    });
});