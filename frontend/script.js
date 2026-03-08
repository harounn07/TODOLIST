const API="http://localhost:3000";

async function loadTasks(){
const res=await fetch(API+"/todos");
const data=await res.json();

const list=document.getElementById("list");
list.innerHTML="";

data.forEach(t=>{
const li=document.createElement("li");
li.innerHTML=t.task+" <button onclick='deleteTask("+t.id+")'>X</button>";
list.appendChild(li);
});
}

async function addTask(){

const task=document.getElementById("task").value;

await fetch(API+"/todos",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({task})
});

loadTasks();
}

async function deleteTask(id){

await fetch(API+"/todos/"+id,{
method:"DELETE"
});

loadTasks();
}

loadTasks();
