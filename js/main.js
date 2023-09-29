'use strict';



    const form = document.querySelector('#form');
    const taskInput = document.querySelector('#taskInput');
    const tasksList = document.querySelector('#tasksList');
    const emptyList = document.querySelector('#emptyList');

    //СОБЫТИЯ ----------------------------------------

    form.addEventListener('submit', addTask); // submit срабатывает при отправке формы
    tasksList.addEventListener('click', delTask);
    tasksList.addEventListener('click', doneTask);

    //СОБЫТИЯ ----------------------------------------


    //МАССИВ ДЛЯ ЛОКАЛ-S ----------------------------------------

    let tasks = [];

    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));//получение данных из Local Storage
    }

    tasks.forEach( (task) => renderTask(task));

    checkEmptyList();//отображение блока о том что список задач пуст

    //МАССИВ ДЛЯ ЛОКАЛ-S ----------------------------------------


    // ФУНКЦИИ ----------------------------------------

    function addTask (e) {
        e.preventDefault(); //отмена стандартного поведения(отмена отправки формы)
        const taskText = taskInput.value; // получение текста задачи 

        const newTask = {
            id: Date.now(),//формирование id по полученным милисекундам
            text: taskText,
            done: false
        };// объект с данными о задаче

        tasks.push(newTask);// push добавляет элемент в конец массива
        saveToLocalStorage();// сохраннение в LOCAL STORAGE

        renderTask(newTask);

        taskInput.value = '';// очистка строки после ввода
        taskInput.focus();// оставляем фокус на строке( свечение вокруг строки)
        checkEmptyList();           
    }// добавление задачи

    function delTask (e) {
        const delBtn = e.target;

        if (delBtn.dataset.action !== 'delete') {
            return;
        }

        else{
            const delBtnParent = delBtn.closest('.list-group-item');// поиск родителя элемента

            const id = Number(delBtnParent.id);

            const index = tasks.findIndex( (task) => task.id === id);//позволяет выполнить функцию для каждого индекса массива

            tasks.splice(index, 1);// позволяет вырезать элемент начиная с указанного и дальше указывается кол-во
            saveToLocalStorage();// сохраннение в LOCAL STORAGE

            delBtnParent.remove();

            // if (tasksList.children.length === 1) {
            //     emptyList.classList.remove('none');
            // }// если задач не осталось, то ребенок остался один, то есть 'задач нет"
            // // поэтому мы его снова отображаем
        }
        checkEmptyList();
        
                
    }// удаление задачи

    function doneTask (e) {
        const doneBtn = e.target;
        const doneBtnParent = doneBtn.closest('.list-group-item');

        if (doneBtn.dataset.action !== 'done') {
            return;
        }
        else {
            const taskTitle = doneBtnParent.querySelector('.task-title');            
            taskTitle.classList.add('task-title--done');
        }
        
        const id = doneBtnParent.id;//ID задачи

        const task = tasks.find((task) => task.id == id);// find возвращает найденный элемент        
        task.done = !task.done;

        saveToLocalStorage();// сохраннение в LOCAL STORAGE
        
    }// выделение задачи как сделанной
    
    function checkEmptyList () {
        if (tasks.length === 0) {
            const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
                                   <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                                   <div class="empty-list__title">Список дел пуст</div>
                                   </li>`;
            tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);                       
        }
        else {
            const emptyListElement = document.querySelector('#emptyList');
            if (emptyListElement) {
                emptyListElement.remove();
            }
        }
    }//проверка, нужен ли блок с надписью 'список дел пуст'

    function saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }//сохранение массива в локальное хранилище LocalStorage

    function renderTask(task) {
        const cssClass = task.done ? 'task-title task-title--done': 'task-title';// формирование css класса

        const taskOnSite = `<li id ='${task.id}'class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${task.text}</span>
        <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
    </li>`;// вставка текста из строки ввода в верстку

        tasksList.insertAdjacentHTML('beforeend', taskOnSite);// отображение новой задачи на сайте
    }//встраивание задач на страницу

    // ФУНКЦИИ ----------------------------------------

    


