let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = null;

function clearErrors(){
  nameError.textContent = "";
  rollError.textContent = "";
}

function addOrUpdateStudent(){
  const name = nameInput.value.trim();
  const roll = rollInput.value.trim();

  clearErrors();
  let error = false;

  if(!name){
    nameError.textContent = "Please enter student name";
    error = true;
  }

  if(!roll){
    rollError.textContent = "Please enter roll number";
    error = true;
  } else if(!/^[0-9]+$/.test(roll)){
    rollError.textContent = "Roll number must be numeric";
    error = true;
  }

  if(error) return;

  // Duplicate check (Name + Roll)
const isDuplicate = students.some((student, index) => {
  // while editing, ignore the same record
  if (editIndex !== null && index === editIndex) return false;

  return (
    student.name.toLowerCase() === name.toLowerCase() &&
    student.roll === roll
  );
});

if (isDuplicate) {
  alert("Student with same Name and Roll Number already exists!");
  return;
}

  if(editIndex === null){
    students.push({ name, roll });
  } else {
    students[editIndex] = { name, roll };
    editIndex = null;
  }

  localStorage.setItem("students", JSON.stringify(students));
  nameInput.value = "";
  rollInput.value = "";
  renderStudents();
}

function editStudent(index){
  nameInput.value = students[index].name;
  rollInput.value = students[index].roll;
  editIndex = index;
}

function deleteStudent(index){
  students.splice(index,1);
  localStorage.setItem("students", JSON.stringify(students));
  renderStudents();
}

function renderStudents(){
  const q = search.value.toLowerCase();
  studentList.innerHTML = "";

  students
    .filter(s => s.name.toLowerCase().includes(q) || s.roll.includes(q))
    .forEach((s,i)=>{
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${s.name} (Roll: ${s.roll})</span>
        <div class="actions">
          <button onclick="editStudent(${i})">Edit</button>
          <button class="delete" onclick="deleteStudent(${i})">Delete</button>
        </div>
      `;
      studentList.appendChild(li);
    });
}

function toggleTheme(){
  document.body.classList.toggle("dark");
}

const nameInput = document.getElementById("name");
const rollInput = document.getElementById("roll");
const nameError = document.getElementById("nameError");
const rollError = document.getElementById("rollError");
const studentList = document.getElementById("studentList");
const search = document.getElementById("search");

renderStudents();
