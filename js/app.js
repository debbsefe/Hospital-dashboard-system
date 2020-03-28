let tables = [];

const filters = {
  searchText: ""
};

$("#myInput").on("input", () => {
  filters.searchText = $("#myInput").val();
  createTable(tables, filters);
});

const renderTables = function () {
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
const createTable = function (tables, filters) {
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
    let patient_id = $('<td class="patient_id" style="cursor:pointer; color:blue;">' + element.id + '</td>');
    patient_id.on("click", () => {
      updateTable(element);
    });
    let patient_name = $('<td>' + element.Patient_name + '</td>')
    let patient_age = $('<td>' + element.Patient_age + '</td>')
    let patient_gender = $('<td>' + element.Patient_gender + '</td>')
    let tr = $('<tr></tr>');

    tr.append(patient_id);
    tr.append(patient_name);
    tr.append(patient_age);
    tr.append(patient_gender);
    tr.append(buttonElement);
    $("#patientTable")
      .find("tBody")
      .append(tr);

  });
};

//Delete Patient record
const deleteTable = function (element) {
  if (confirm('Are you sure you want to delete this record?')) {
    db.collection("tables")
      .doc(element.id)
      .delete()
      .then(() => {
        alert("Patient record deleted successfully!");
        location.reload();
      });
  } else {
  }
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
  
  let valid = true;

  if(table.Patient_age===""){
    document.querySelector(".ageBlank").innerText = 'Age cannot be empty';
    valid = false;
  } else {
    document.querySelector(".ageBlank").innerText = '';
    valid = true;
  }
  
  if(table.Patient_name===""){
    document.querySelector(".nameBlank").innerText = 'Name cannot be empty';
    valid = false;
  } else {
    document.querySelector(".nameBlank").innerText = '';
    valid = true;
  }
  
  if(valid === true) {
    // execute if form is valid
    db.collection("tables")
      .doc(id)
      .set(table)
      .then(() => {
        closeModal();
        alert("Patient added successsfully!");
        location.reload();
      })
      .catch(error => {
        alert("Error adding patient", e);
      });

  }    
 
});

//Grab table row value to form
const updateTable = function (element) {
  updateModal.style.display = "block";
  document.querySelector("#update_name").setAttribute("value", element.Patient_name);
  document.querySelector("#update_age").setAttribute("value", element.Patient_age);
  document.querySelector("#update_gender").value = element.Patient_gender;

  $("#updatePatient").click(event => {
    event.preventDefault();
    const id = element.id;
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
        alert("Updated successfully.");
        tables.push(table);
        createTable(tables, filters);
      })
      .catch(error => {
        console.log("Error occured", error);
      });
  });
}

renderTables();
