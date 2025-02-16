// recuperer les elements html necessaires
const userInput = document.getElementById('userInput');
const display = document.getElementById('list');
const form = document.getElementById('addtodo');
const search = document.getElementById('searchbar');

// charger les todos depuis le localstorage ou initialiser un tableau vide
let todos = JSON.parse(localStorage.getItem('todos')) || ["play mariokart", "defeat ganon in zelda", "make a veggie pie"];

// fonction pour afficher la liste des todos
function showTodos(LIST) {
    display.innerHTML = ""; // vider la liste avant de la mettre à jour

    LIST.forEach((todo, index) => {
        let listitem = document.createElement('li');
        listitem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        let NewTodo = document.createElement("span");
        NewTodo.textContent = todo;

        let deleteicon = document.createElement('i');
        deleteicon.classList.add("far", "fa-trash-alt", "delete");

        deleteicon.addEventListener('click', function () {
            removeTodo(index);
        });

        listitem.appendChild(NewTodo);
        listitem.appendChild(deleteicon);
        display.appendChild(listitem);
    });
};

// fonction pour ajouter un todo
function addTodo(todo) {
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos)); // sauvegarder dans le localstorage
    showTodos(todos); // mettre a jour l'affichage
};

// fonction pour supprimer un todo
function removeTodo(todo_index) {
    todos.splice(todo_index, 1);
    localStorage.setItem('todos', JSON.stringify(todos)); // mettre a jour le localstorage
    showTodos(todos); // mettre a jour l'affichage
};

// ecouter la soumission du formulaire pour ajouter un nouveau todo
form.addEventListener('submit', function (event) {
    event.preventDefault(); // empecher le rechargement de la page
    const newTodo = userInput.value.trim();
    if (newTodo !== "") {
        addTodo(newTodo);
        userInput.value = "";
        showTodos(todos); // mettre a jour l'affichage
    }
});

// ecouter l'input de recherche pour filtrer les todos
search.addEventListener('input', function (event) {
    event.preventDefault();
    const searched = event.target.value.toLowerCase();
    const filteredTodos = todos.filter(todo =>
        todo.toLowerCase().startsWith(searched)
    );
    showTodos(filteredTodos); // afficher la liste filtree
});

// afficher les todos au chargement de la page
showTodos(todos);