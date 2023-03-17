const doc = {
  tbody: null,
};
const state = {
  dolgozoLista: [],
  host: null,
  saveButton: null,
};

window.addEventListener("load", () => {
  init();
});

async function init() {
  state.host = "http://localhost:8000/";
  doc.tbody = document.querySelector("#tbody");
  doc.saveButton = document.querySelector("#saveButton");
  doc.saveButton.addEventListener("click", () => {
    console.log("működik");
  });
  getEmployee();
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
  let url = state.host + endpoint + "/" + id;
  fetch(url, { method: "DELETE" })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      getEmployee();
      render();
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
