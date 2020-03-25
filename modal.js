
var modal = document.getElementById('modalForm');
var modalBtn = document.getElementById('modalBtn');
var closeBtn = document.querySelector('.closeBtn');
var form = document.querySelector('.formContent');
var updateModal = document.querySelector('.updateModal');
var closeUpdateBtn = document.querySelector('.closeUpdateBtn');

modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', windowClick);
closeUpdateBtn.addEventListener('click', closeUpdateModal);
filterPatient.addEventListener('keyup', filterItems);

function openModal(){
    modal.style.display = 'block';
}
function closeModal(){
    modal.style.display = 'none';
}
function windowClick(e){
    if(e.target == modal || e.target == updateModal){
    modal.style.display = 'none';
    updateModal.style.display = 'none';
    }
}
function closeUpdateModal(){
    updateModal.style.display = 'none';
}

