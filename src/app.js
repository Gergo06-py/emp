const doc = {
  tbody: document.querySelector("#tbody"),
  saveButton: document.querySelector("#saveButton"),
  idInput: document.querySelector("#id"),
  nameInput: document.querySelector("#name"),
  cityInput: document.querySelector("#city"),
  salaryInput: document.querySelector("#salary"),
  operationModalLabel: document.querySelector("#operationModalLabel"),
};
const state = {
  dolgozoLista: [],
  host: null,
  adding: true
};

window.addEventListener("load", () => {
  init();
});

function init() {
  state.host = "http://localhost:8000/";
  doc.saveButton.addEventListener("click", () => {
    if (state.adding)
      startAddEmployee();
    else
      startUpdate();
  });
  getEmployee();
}

function startAddEmployee() {
  let name = doc.nameInput.value;
  let city = doc.cityInput.value;
  let salary = Number(doc.salaryInput.value);
  let employee = {
    name: name,
    city: city,
    salary: salary,
  };
  addEmployee(employee);
}

function addEmployee(employee) {
  let endpoint = "employees";
  let url = state.host + endpoint;
  fetch(url, {
    method: "POST",
    body: JSON.stringify(employee),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      clearModalFields();
    });
}

function clearModalFields() {
  doc.nameInput.value = "";
  doc.cityInput.value = "";
  doc.salaryInput.value = "";
}

function getEmployee() {
  let endpoint = "employees";
  let url = state.host + endpoint;
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      state.dolgozoLista = result;
      render();
    });
}

function deleteEmployee(id) {
  let endpoint = "employees";
  let url = state.host + endpoint + id;
  fetch(url, { method: "DELETE" })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      getEmployee();
      render();
    });
}

function startEditEmployee(event) {
  state.adding = false;
  let id = event.getAttribute("data-id");
  let name = event.getAttribute("data-name");
  let city = event.getAttribute("data-city");
  let salary = event.getAttribute("data-salary");
  // console.log(id, name);
  doc.idInput.value = id;
  doc.nameInput.value = name;
  doc.cityInput.value = city;
  doc.salaryInput.value = salary;
  doc.operationModalLabel.textContent = "Szerkesztés";
}

function startUpdate() {
  let id = doc.idInput.value;
  let name = doc.nameInput.value;
  let city = doc.cityInput.value;
  let salary = doc.salaryInput.value;
  let employee = {
    id: id,
    name: name,
    city: city,
    salary: salary,
  };
  updateEmployee(employee);
  state.adding = true;
}

function updateEmployee(employee) {
  let endpoint = 'employees';
  let url = state.host + endpoint + '/' + employee.id;
  fetch(url, {
    method: 'PUT',
    body: JSON.stringify(employee),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(result => {
    console.log(result);
  });
}

function startDeleteEmployee(event) {
  let id = event.getAttribute("data-id");
  deleteEmployee(id);
}

function render() {
  let rows = "";

  state.dolgozoLista.forEach((dolgozo) => {
    rows += `
      <tr>
        <td>${dolgozo.id}</td>
        <td>${dolgozo.name}</td>
        <td>${dolgozo.city}</td>
        <td>${dolgozo.salary}</td>
        <td>
          <button
            class="btn btn-warning"
            onclick="startEditEmployee(this)"
            data-id="${dolgozo.id}"
            data-name="${dolgozo.name}"
            data-city="${dolgozo.city}"
            data-salary="${dolgozo.salary}"
            data-bs-toggle="modal"
            data-bs-target="#operationModal"
          >
            Szerkesztés
          </button>
        </td>
        <td>
          <button
            class="btn btn-danger"
            onclick="startDeleteEmployee(this)"
            data-id="${dolgozo.id}"
          >
            Törlés
          </button>
        </td>
      </tr>
    `;
  });
  doc.tbody.innerHTML = rows;
}
