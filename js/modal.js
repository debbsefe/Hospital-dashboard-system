var modal = document.getElementById("modalForm");
var modalBtn = document.getElementById("modalBtn");
var closeBtn = document.querySelector(".closeBtn");
var form = document.querySelector(".formContent");
var updateModal = document.querySelector(".updateModal");
var closeUpdateBtn = document.querySelector(".closeUpdateBtn");
var patientName = document.querySelector('#patient_name');
var nameBlank = document.querySelector('.nameBlank');
var ageBlank = document.querySelector('.ageBlank');
var patientAge = document.querySelector('#patient_age');


modalBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", windowClick);
closeUpdateBtn.addEventListener("click", closeUpdateModal);
patientName.addEventListener("keyup", closeSpanPatient);
patientAge.addEventListener("keyup", closeSpanAge);

function openModal() {
  modal.style.display = "block";
}
function closeModal() {
  modal.style.display = "none";
}
function windowClick(e) {
  if (e.target == modal || e.target == updateModal) {
    modal.style.display = "none";
    updateModal.style.display = "none";
  }
}
function closeUpdateModal() {
  updateModal.style.display = "none";
}

function closeSpanPatient(){
  if(patientName.value === "") {
    nameBlank.style.display = "block";
  } else {
    nameBlank.style.display = "none";
  }
}
function closeSpanAge(){
  if(patientAge.value === ""){
    ageBlank.style.display = "block";
  } else {
    ageBlank.style.display = "none";
  }
}