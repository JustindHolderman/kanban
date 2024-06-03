let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

function generateTaskId() {
if(nextId === null){
    nextId = 1
}else{
    nextId++;

}
localStorage.setItem('nextId', JSON.stringify(nextId));
return nextId
}



function createTaskCard(task) {
  const taskCard = $(`<div>`)
    .addClass(`card w-75 task-card draggable my-3`)
    .attr(`data-task-id`, task.id);
  const cardHeader = $(`<div>`).addClass(`card-header h4`).text(task.name);
  const cardBody = $("<div>").addClass(`card-body`);
  const cardDescription = $(`<p>`).addClass(`card-text`).text(task.type);
  const cardDueDate = $(`<p>`).addClass(`card-text`).text(task.dueDate);
  const cardDeleteBtn = $(`<button>`)
    .addClass(`btn btn-danger delete`)
    .text(`Delete`)
    .attr(`data-task-id`, task.id);
  cardDeleteBtn.on("click", handleDeleteTask);

  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }

  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);
  return taskCard;
}

function renderTaskList() {

    let toDoContainer = $(`#todo-cards`);
    let inProgressContainer = $(`#in-progress-cards`);
    let doneContainer = $(`#done-cards`);

if (!taskList){
    taskList = []
}

  toDoContainer.empty();
  inProgressContainer.empty();
  doneContainer.empty();

for (let task of taskList) {
    if (task.status === 'to-do' ){
        toDoContainer.append(createTaskCard(task))

    }else if (task.status === 'in-progress' ){
        inProgressContainer.append(createTaskCard(task))
    }else {
        doneContainer.append(createTaskCard(task))
    }

}


  $(".draggable").draggable({
    opacity: 0.7,
    zIndex: 100,
     helper: function (e) {
         const original = $(e.target).hasClass('ui-draggable')
           ? $(e.target)
           : $(e.target).closest('.ui-draggable');
         return original.clone().css({
           maxWidth: original.outerWidth(),
         });
       },
     });
}

function handleAddTask(event) {
  event.preventDefault();

  const newtask = {
    id: generateTaskId(),
    name:  $("#title").val().trim(),
    type:  $("#content").val().trim(),
    dueDate: $("#dueDate").val(),
    status: "to-do",
  };

  taskList.push(newtask);

localStorage.setItem('tasks', JSON.stringify(taskList));

renderTaskList();

  $("#title").val(" ");
  $("#content").val(" ");
  $("#dueDate").val(" ");
}

function handleDeleteTask(event) {
  event.preventDefault();

  const taskId = $(this).attr(`data-task-id`);

  taskList.forEach((task) => {
    if (task.id === parseInt(taskId)) {
      taskList.splice(taskList.indexOf(task), 1);
    }
  });


    renderTaskList();
}

function handleDrop(event, ui) {
         
  const taskId = ui.draggable[0].dataset.taskId;

  const newStatus = event.target.id;

  for (let task of taskList) {
    if (task.id === parseInt(taskId)) {
      task.status = newStatus;
    }
  }
  localStorage.setItem(`tasks`, JSON.stringify(taskList));
  renderTaskList();

}

$(document).ready(function () {

  renderTaskList();

  const taskFormEl = $(`#task-form`);
  taskFormEl.on(`submit`, handleAddTask);

  $(`.lane`).droppable({
    accept: `.draggable`,
    drop: handleDrop,
  });


});