let encounters = [];

const filters = {
  searchText: ""
};

$("#myInput").on("input", () => {
  filters.searchText = $("#myInput").val();
  createEncounter(encounters, filters);
});

const renderEncounters = function() {
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
const createEncounter = function(encounters, filters) {
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
    let timestamp: TimeInterval = 1541764115618;
    let date = Date((timeIntervalSince1970: timestamp));
    let tr = $(
      "<tr><td>" +
        element.id +
        "</td>" +
        "<td>" +
        element.symptom +
        "</td>" +
        "<td>" +
        element.prescription +
        "</td>" +
        "<td>" +
        element.admitted +
        "<td>" +
        element.date +
        "</td> </tr>"
    );
    tr.append(buttonElement);
    $("#encounterTable")
      .find("tBody")
      .append(tr);
  });
};

const deleteEncounter = function(element) {
  db.collection("encounters")
    .doc(element.id)
    .delete()
    .then(() => {
      alert("Patient record deleted successfully!");
      const encounterIndex = encounters.findIndex(
        encounter => encounter.id === element.id
      );
      if (encounterIndex != 1) {
        encounters.splice(encounterIndex, 1);
        createEncounter(encounters, filters);
      }
    });
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
      alert("Encounter added successsfully!");
      encounters.push(encounter);
      createEncounter(encounters, filters);
    })
    .catch(error => {
      alert("Error adding encounter", e);
    });
});

renderEncounters();
