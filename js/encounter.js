let encounters = [];

const filters = {
  searchText: ""
};

$("#myInput").on("input", () => {
  filters.searchText = $("#myInput").val();
  createEncounter(encounters, filters);
});

const renderEncounters = function () {
  db.collection("encounters")
    .get()
    .then(data => {
      data.docs.forEach(element => {
        const singleEncounter = element.data();
        encounters.push(singleEncounter);
      });
      createEncounter(encounters, filters);
    });
};

//METHOD TO DISPLAY Encounter
const createEncounter = function (encounters, filters) {
  const filteredEncounters = $.grep(encounters, element => {
    return element.symptom
      .toLowerCase()
      .includes(filters.searchText.toLowerCase());
  });
  $("#tbody").empty();
  filteredEncounters.forEach(element => {
    let buttonElement = $('<button class="btn-danger btn-sm">');
    buttonElement.text("X");
    buttonElement.on("click", () => {
      deleteEncounter(element);
    });

    let patient_id = $('<td class="patient_id" style="cursor:pointer; color:blue;">' + element.id + '</td>');
    let symptom = $('<td>' + element.symptom + '</td>');
    let prescription = $('<td>' + element.prescription + '</td>');
    let admitted = $('<td>' + element.admitted + '</td>');
    let dateTimestamp = element.date;
    let dateString = dateTimestamp.toDate();
    let localString = $('<td>' + dateString + '</td>');
    let tr = $('<tr></tr>');

    tr.append(patient_id);
    tr.append(symptom);
    tr.append(prescription);
    tr.append(admitted);
    tr.append(localString);
    tr.append(buttonElement);
    $("#encounterTable")
      .find("tBody")
      .append(tr);
  });
};

const deleteEncounter = function (element) {
  if (confirm('Are you sure you want to delete this record?')) {
    db.collection("encounters")
      .doc(element.id)
      .delete()
      .then(() => {
        alert("Patient encounter deleted successfully!");
        const encounterIndex = encounters.findIndex(
          encounter => encounter.id === element.id
        );
        if (encounterIndex != 1) {
          encounters.splice(encounterIndex, 1);
          createEncounter(encounters, filters);
        }
      });
  } else {

  }
};

$("#saveEncounter").click(event => {
  event.preventDefault();
  const id = $("#patientid").val();
  const encounter = {
    symptom: $("#symptom").val(),
    prescription: $("#prescription").val(),
    admitted: $("#admitted").val(),
    id: id,
    date: firebase.firestore.FieldValue.serverTimestamp()
  };
  db.collection("encounters")
    .doc(id)
    .set(encounter)
    .then(() => {
      closeModal();
      alert("Encounter added successsfully!");
      encounters.push(encounter);
      createEncounter(encounters, filters);
    })
    .catch(error => {
      alert("Error adding encounter", e);
    });
});



renderEncounters();
