let tables = [];

const filters ={
    searchText: ''
}

$('#myInput').on('input', () =>{
    filters.searchText = $('#myInput').val();
    createTable(tables, filters);
})

const renderTables = function(){

    db.collection('tables').get().then(data =>{
        data.docs.forEach(element =>{
            const singleTable = element.data();
            tables.push(singleTable);
        })    
        createTable(tables, filters);
    });
}

//METHOD TO DISPLAY TABLE
const createTable = function(tables, filters){
   const filteredTables = $.grep(tables, element =>{
        return element.Patient_name.toLowerCase().includes(filters.searchText.toLowerCase());
    })
    $("#tbody").empty();
    filteredTables.forEach(element =>{
        let buttonElement = $('<button>');
        buttonElement.text('X');
        buttonElement.on('click', ()=>{
            deleteTable(element);
        })
        let tr = $("<tr><td>"+ element.id + "</td>" + "<td>" + element.Patient_name  + "</td>" + "<td>" + element.Patient_age  + "</td>" + "<td>" + element.Patient_gender + "</td> </tr>");
        tr.append(buttonElement);
        $("#patientTable").find("tBody").append(tr);
    })
}

const deleteTable = function(element){

    db.collection('tables').doc(element.id).delete().then(()=>{
        alert('Patient record deleted successfully!')
        const tableIndex = tables.findIndex(table => table.id === element.id)
    if(tableIndex != 1){
        tables.splice(tableIndex, 1);
        createTable(tables, filters);
    }
    });  
}
$('#savePatient').click((event)=>{
    event.preventDefault();
    const id = uuidv4();
    const table = {
        Patient_name : $('#patient_name').val(),
        Patient_age : $('#patient_age').val(),
        Patient_gender : $('#patient_gender').val(),
        id : id
    }
    db.collection('tables').doc(id).set(table).then(()=>{
        alert('Patient added successsfully!');
        tables.push(table);
        createTable(tables, filters);
    }).catch(error=>{
        alert('Error adding patient', e)
    })
})

renderTables();