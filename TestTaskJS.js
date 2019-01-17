"use strict";

function ModalWindow() {

    document.body.insertAdjacentHTML('afterBegin', '<!-- Модальное окно -->' +
                                                   '<div id="modal-window">' +
                                                       '<span id="headline"></span>' + 
                                                       '<span id="close-button">X</span><br>' +
                                                       '<div id="selection-window">' +
                                                           '<table></table>' +
                                                       '</div>' +
                                                       '<div id="button-panel">' +
                                                           '<div>Ок</div>' +
                                                           '<div>Отмена</div>' +
                                                       '</div>' +
                                                   '</div>' + 
                                                   '<!-- Модальное окно -->' +
                                                   '<div id="overlay"></div>'); 
  
    this.open = function() {
        $('#overlay').fadeIn(400, 
            function(){ 
                $('#modal-window') 
                    .css('display', 'block') 
                    .animate({opacity: 1, top: '50%'}, 200); 
        });
    };
  
    this.close = function() {
        $('#modal-window')
		.animate({opacity: 0, top: '45%'}, 200,  
                    function(){ 
			$(this).css('display', 'none'); 
			$('#overlay').fadeOut(400); 
                    }
		);     
    };

}

/* Функция сравнения для сотрудников */
function compareEmployees(a,b) {  
    if (a.lastname < b.lastname)
        return -1;
    if (a.lastname > b.lastname)
        return 1;
    if (a.middlename < b.middlename)
        return -1;
    if (a.middlename > b.middlename)
        return 1;
    if (a.firstname < b.firstname)
        return -1;
    if (a.firstname > b.firstname)
        return 1;
    return 0;
}

/* Функция сравнения для должностей, организаций и подразделений */
function comparePosOrgSub(a,b) {  
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}

$(document).ready(function() { 
    var tableID;
    var modalWindow = new ModalWindow();
    /* Открытие модального окна */
    $('.open-window').click( function(event){ 

	tableID = event.target.parentNode.getAttribute('id'); 
                
        /* Заволнение окна данными из JSON файлов */
        switch (tableID) {                   
            case 'employee':
                $('#headline').text("Выбор сотрудника");
                $('#selection-window table').html("<tr>\n\
                                                       <th>Фамилия</th>\n\
                                                       <th>Имя</th>\n\
                                                       <th>Отчество</th>\n\
                                                       <th>Дата рождения</th>\n\
                                                   </tr>");
                $.getJSON('persons.json', function(data){
                    data.sort(compareEmployees);
                    for(let i = 0; i < data.length; i++){
                        $('#selection-window table').append('<tr class="accentuated" id="' + data[i].id + '"><td>' 
                                                                + data[i].lastname + 
                                                                '</td><td>' 
                                                                + data[i].middlename + 
                                                                '</td><td>' 
                                                                + data[i].firstname + 
                                                                '</td><td>' 
                                                                + data[i].birthday + 
                                                            '</td></tr>');           
                    }  
                });                    
                break;
                        
            case 'position':
                $('#headline').text("Выбор должности");
                $('#selection-window table').html("<tr>\n\
                                                       <th>Название</th>\n\
                                                       <th>Минимальный возраст</th>\n\
                                                       <th>Максимальный возраст</th>\n\
                                                   </tr>");
                $.getJSON('positions.json', function(data){
                    data.sort(comparePosOrgSub);
                    for(let i = 0; i < data.length; i++){
                        $('#selection-window table').append('<tr class="accentuated"><td>' 
                                                                + data[i].name + 
                                                                '</td><td>' 
                                                                + data[i].min_age + 
                                                                '</td><td>' 
                                                                + data[i].max_age + 
                                                            '</td></tr>');           
                    }    
                });  
                break;
                        
            case 'organization':
                $('#headline').text("Выбор организации");  
                $('#selection-window table').html("<tr>\n\
                                                       <th>Название</th>\n\
                                                       <th>Страна</th>\n\
                                                   </tr>");
                $.getJSON('orgs.json', function(data){
                    data.sort(comparePosOrgSub);
                    for(let i = 0; i < data.length; i++){
                        $('#selection-window table').append('<tr class="accentuated"><td>' 
                                                                + data[i].name + 
                                                                '</td><td>' 
                                                                + data[i].country + 
                                                            '</td></tr>');
                    }     
                });  
                break;
                        
            case 'subdivision':
                $('#headline').text("Выбор подразделения");
                $('#selection-window table').html("<tr>\n\
                                                                <th>Название</th>\n\
                                                                <th>Организация</th>\n\
                                                           </tr>");
                $.getJSON('subs.json', function(dataSubs){
                    $.getJSON('orgs.json', function(dataOrgs){
                        dataSubs.sort(comparePosOrgSub);
                        for(let i = 0; i < dataSubs.length; i++){
                            $('#selection-window table').append('<tr class="accentuated"><td>' 
                                                                    + dataSubs[i].name + 
                                                                    '</td><td>' 
                                                                    + dataOrgs.find(x => x.id === dataSubs[i].org_id).name + 
                                                                '</td></tr>');
                        }
                    });
                });                  
                break;                       
        }
        
        modalWindow.open();        
    });
    
    /* Работа с содержимым модального окна */
    $('#selection-window table').click( function(event){ 
        if (event.target.tagName === 'TD'){
            event.target.parentNode.id = 'selected';          
            return;
        }
        if (event.target.tagName === 'TR'){
            event.target.style.backgroundColor = 'turquoise'; 
            return;
        }
    });
    
    /* Нажатие клавиши Ок */
    $('#button-panel div:first-child').click( function(){        
        switch (tableID) {                   
            case 'employee':
                var display = document.getElementById('selected').cells[0].innerText + ' ' 
                      + document.getElementById('selected').cells[1].innerText + ' '
                      + document.getElementById('selected').cells[2].innerText;
                $('#nameEmployee').text(display);                   
                break;
                        
            case 'position':
                var display = document.getElementById('selected').cells[0].innerText;
                $('#namePosition').text(display);                   
                break;
                        
            case 'organization':
                var display = document.getElementById('selected').cells[0].innerText;
                $('#nameOrganization').text(display);                   
                break;
                        
            case 'subdivision':
                var display = document.getElementById('selected').cells[0].innerText;
                $('#nameSubdivision').text(display);                   
                break;                       
        }              
    });
    
    /* Зaкрытие мoдaльнoгo oкнa */
    $('#close-button,#button-panel div:first-child, #button-panel div:last-child').click( function(){ 
        modalWindow.close();        
    });
});


