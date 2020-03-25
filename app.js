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
        $("#myTable").find("tBody").append("<tr><td>"+ element.id + "</td>" + "<td>" + element.Patient_name  + "</td>" + "<td>" + element.Patient_age  + "</td>" + "<td>" + element.Patient_gender + "</td> </tr>");
    })
}

$('.savePatient').click((event)=>{
    event.preventDefault();
    const id = uuidv4();
    const table = {
        Patient_name : $('#patient_name').val(),
        Patient_age : $('#patient_age').val(),
        Patient_gender : $('#patient_gender').val(),
        id : id
    }
    db.collection('tables').doc(id).set(table).then(()=>{
        console.log('Patient added successsfully!');
        tables.push(table);
        createTable(tables, filters);
    }).catch(error=>{
        console.log('Error adding patient', e)
    })
})

renderTables();