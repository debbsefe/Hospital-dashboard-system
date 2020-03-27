let tables = [];

const filters = {
  searchText: ""
};

$("#myInput").on("input", () => {
  filters.searchText = $("#myInput").val();
  createTable(tables, filters);
});

const renderTables = function() {
  db.collection("tables")
    .get()
    .then(data => {
      data.docs.forEach(element => {
        const singleTable = element.data();
        tables.push(singleTable);
      });
      createTable(tables, filters);
    });
};

//METHOD TO DISPLAY TABLE
const createTable = function(tables, filters) {
  const filteredTables = $.grep(tables, element => {
    return element.Patient_name.toLowerCase().includes(
      filters.searchText.toLowerCase()
    );
  });
  $("#tbody").empty();
  filteredTables.forEach(element => {
    let buttonElement = $('<button class="btn-danger btn-sm">');
    buttonElement.text("X");
    buttonElement.on("click", () => {
      deleteTable(element);
    });
    let tr = $(
      "<tr><td class='patient_id' id ='patient_id' style='cursor:pointer; color:blue;'>" +
        element.id +
        "</td>" +
        "<td>" +
        element.Patient_name +
        "</td>" +
        "<td>" +
        element.Patient_age +
        "</td>" +
        "<td>" +
        element.Patient_gender +
        "</td> </tr>"
    );
    tr.append(buttonElement);
    $("#patientTable")
      .find("tBody")
      .append(tr);
  });
};

//Delete Patient record
const deleteTable = function(element) {
  db.collection("tables")
    .doc(element.id)
    .delete()
    .then(() => {
      alert("Patient record deleted successfully!");
      const tableIndex = tables.findIndex(table => table.id === element.id);
      if (tableIndex != 1) {
        tables.splice(tableIndex, 1);
        createTable(tables, filters);
      }
    });
};

//Save new patient record
$("#savePatient").click(event => {
  event.preventDefault();
  const id = uuidv4();
  const table = {
    Patient_name: $("#patient_name").val(),
    Patient_age: $("#patient_age").val(),
    Patient_gender: $("#patient_gender").val(),
    id: id
  };
  db.collection("tables")
    .doc(id)
    .set(table)
    .then(() => {
      closeModal();
      alert("Patient added successsfully!");
      tables.push(table);
      createTable(tables, filters);
    })
    .catch(error => {
      alert("Error adding patient", e);
    });
});

$("body").on("click", ".patient_id", () => {
  const id = $("#patient_id").text();
  db.collection("tables")
    .doc(id)
    .get()
    .then(function(doc) {
      let docArray = doc.data();
      updateModal.style.display = "block";
      document
        .querySelector("#update_name")
        .setAttribute("value", docArray.Patient_name);
      document
        .querySelector("#update_age")
        .setAttribute("value", docArray.Patient_age);
      document.querySelector("#update_gender").value = docArray.Patient_gender;
    });
});

$("#updatePatient").click(event => {
  event.preventDefault();
  const id = $("#patient_id").text();
  const table = {
    Patient_name: $("#update_name").val(),
    Patient_age: $("#update_age").val(),
    Patient_gender: $("#update_gender").val(),
    id: id
  };
  db.collection("tables")
    .doc(id)
    .update(table)
    .then(() => {
      closeUpdateModal();
      tables.push(table);
      alert("Updated successfully.");
      createTable(tables, filters);
    })
    .catch(error => {
      console.log("Error occured", error);
    });
});

renderTables();
