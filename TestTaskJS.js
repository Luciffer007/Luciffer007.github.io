"use strict";

var message1 = 'Выбранный сотрудник не подходит по возрасту. Вы уверены, что хотите выбрать этого сотрудника?';
var message2 = 'Выбранная должность не подходит по возрасту сотруднику. Вы уверены, что хотите выбрать эту должность?';

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

/* Функция получения полного имени */
function getFullName(person) {
            return person.lastname + person.middlename + person.firstname;
}

/* Функция сравнения для сотрудников */
function compareEmployees(a,b) { 
    if ( getFullName(a) < getFullName(b) )
        return -1;
    if ( getFullName(a) > getFullName(b) )
        return 1;
    return 0;
}

/* Функция сравнения для должностей, организаций и подразделений */
function comparePosOrgSub(a,b) {     
    if ( a.name < b.name )
        return -1;
    if ( a.name > b.name )
        return 1;
    return 0;
}

function compareId(id1, id2) { 
    if ( id1 == id2 ) {
      return 'selected';
    }
}

/* Пооиск в массиве объекта с нужным ID */
function findById(source, id) {
  for ( var i = 0; i < source.length; i++ ) {
    if ( source[i].id === id ) {
      return source[i];
    }
  }
}

/* Вычисление возраста работника */
function getAge(date) {
  var dateMas = date.split('.');
  var dateFormat = dateMas[2] + '-' + dateMas[1] + '-' + dateMas[0]; 
  return ((new Date().getTime() - new Date(dateFormat)) / (24 * 3600 * 365.25 * 1000)) | 0;
}

function checkCompliance(age, min, max, message) {
                if ( min ) {
                    if( age < +min  || age > +max ){
                        var result = confirm(message);
                        if( result )
                            return 0;
                        return 1;
                    }
                }
}

/* Запись данных в окна */
function recordData(selector, data) {
    $(selector).html(data + '<span class="delete">X</span>'); 
    var iter = arguments.length;
    while ( iter > 2 ) {
        $(selector).attr(arguments[iter - 2], arguments[iter - 1]);
        iter--;
        iter--;
    }
}

/* Удаление данных из окон */
function deleteData(selector) {
    var args = arguments;
    $(selector).click( function(event){        
        if ( event.target.tagName === 'SPAN' ){
            $(selector).html('');
            var iter = args.length;
            while ( iter > 1 ) {
                $(selector).removeAttr(args[iter - 1]);
                iter--;
            }
        }       
    });    
}

$(document).ready(function() { 
    var tableID;
    var selectItemId;
    var modalWindow = new ModalWindow();
    /* Открытие модального окна */
    $('.open-window').click( function(event){ 

	tableID = event.target.parentNode.getAttribute('id'); 
                
        /* Заполнение окна данными из JSON файлов */
        switch (tableID) {                   
            case 'employee':
                selectItemId = $('#nameEmployee').attr('itemId');
                
                $('#headline').text("Выбор сотрудника");
                $('#selection-window table').html("<tr>\n\
                                                       <th>Фамилия</th>\n\
                                                       <th>Имя</th>\n\
                                                       <th>Отчество</th>\n\
                                                       <th>Дата рождения</th>\n\
                                                   </tr>");
                $.getJSON('persons.json', function(data){
                    data.sort(compareEmployees);
                    for(var i = 0; i < data.length; i++){
                        $('#selection-window table').append('<tr class="accentuated" id="' + compareId(selectItemId, data[i].id) + '" itemId="' + data[i].id + '"><td>' 
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
                selectItemId = $('#namePosition').attr('itemId');
                
                $('#headline').text("Выбор должности");
                $('#selection-window table').html("<tr>\n\
                                                       <th>Название</th>\n\
                                                       <th>Минимальный возраст</th>\n\
                                                       <th>Максимальный возраст</th>\n\
                                                   </tr>");
                $.getJSON('positions.json', function(data){
                    data.sort(comparePosOrgSub);
                    for(var i = 0; i < data.length; i++){
                        $('#selection-window table').append('<tr class="accentuated" id="' + compareId(selectItemId, data[i].id) + '" itemId="' + data[i].id + '"><td>' 
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
                selectItemId = $('#nameOrganization').attr('itemId');
                
                $('#headline').text("Выбор организации");  
                $('#selection-window table').html("<tr>\n\
                                                       <th>Название</th>\n\
                                                       <th>Страна</th>\n\
                                                   </tr>");
                $.getJSON('orgs.json', function(data){
                    data.sort(comparePosOrgSub);
                    for(var i = 0; i < data.length; i++){
                        $('#selection-window table').append('<tr class="accentuated" id="' + compareId(selectItemId, data[i].id) + '" itemId="' + data[i].id + '"><td>' 
                                                                + data[i].name + 
                                                                '</td><td>' 
                                                                + data[i].country + 
                                                            '</td></tr>');
                    }     
                });  
                break;
                        
            case 'subdivision':
                selectItemId = $('#nameSubdivision').attr('itemId');
                
                $('#headline').text("Выбор подразделения");
                $('#selection-window table').html("<tr>\n\
                                                       <th>Название</th>\n\
                                                       <th>Организация</th>\n\
                                                   </tr>");
                $.getJSON('subs.json', function(dataSubs){
                    $.getJSON('orgs.json', function(dataOrgs){
                        dataSubs.sort(comparePosOrgSub);
                        for(var i = 0; i < dataSubs.length; i++){
                            $('#selection-window table').append('<tr class="accentuated" id="' + compareId(selectItemId, dataSubs[i].id) + '" itemId="' + dataSubs[i].id + '"><td>' 
                                                                    + dataSubs[i].name + 
                                                                    '</td><td>' 
                                                                    + findById(dataOrgs, dataSubs[i].org_id).name + 
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
        
        if ( document.getElementById('selected') ){
            document.getElementById('selected').removeAttribute('id');
        }   
        
        if (event.target.tagName === 'TD'){ 
            event.target.parentNode.id = 'selected';  
            return;
        }
        
        if (event.target.tagName === 'TR'){
            event.target.id = 'selected';  
            return;
        }
        
    });
    
    /* Нажатие клавиши Ок */
    $('#button-panel div:first-child').click( function(){        
        switch (tableID) {   
            
            case 'employee':
                
                var selected = document.getElementById('selected');
                var min = $('#namePosition').attr('minAge');
                var max = $('#namePosition').attr('maxAge');
                var age = getAge(selected.cells[3].innerText);
                
                /* Проверка на соответствие должности, если выбрана */
                if ( checkCompliance(age, min, max, message1) )
                    return;
                
                /* Запись данных в окно сотрудника */
                recordData ('#nameEmployee', selected.cells[0].innerText + ' ' + selected.cells[1].innerText + ' ' + selected.cells[2].innerText,
                            'age', age,
                            'itemId', selected.getAttribute('itemId'));
                break;
                        
            case 'position':
                
                var selected = document.getElementById('selected');
                var min = selected.cells[1].innerText;
                var max = selected.cells[2].innerText;
                var age = $('#nameEmployee').attr('age');
                
                /* Проверка на соответствие сотруднику, если выбран */
                if ( checkCompliance(age, min, max, message2) )
                    return;                
                
                /* Запись данных в окно должности */
                recordData ('#namePosition', selected.cells[0].innerText,
                            'minAge', min,
                            'maxAge', max,
                            'itemId', selected.getAttribute('itemId'));
                break;
                        
            case 'organization':
                
                var selected = document.getElementById('selected');
                
                /* Запись данных в окно организации */
                recordData ('#nameOrganization', selected.cells[0].innerText,
                            'itemId', selected.getAttribute('itemId'));                  
                break;
                        
            case 'subdivision':
                
                var selected = document.getElementById('selected');
                
                /* Запись данных в окно подразделения */
                recordData ('#nameSubdivision', selected.cells[0].innerText,
                            'itemId', selected.getAttribute('itemId'));                 
                break;                       
        }              
    });
    
    /* Зaкрытие мoдaльнoгo oкнa */
    $('#close-button, #button-panel div:first-child, #button-panel div:last-child').click( function(){ 
        modalWindow.close();        
    });
    
    /* Удаление данных из окна сотрудника */
    deleteData('#nameEmployee', 'age', 'itemId');
    
    /* Удаление данных из окна должности */
    deleteData('#namePosition', 'minAge', 'maxAge', 'itemId');
    
    /* Удаление данных из окна организации */
    deleteData('#nameOrganization', 'itemId');
    
    /* Удаление данных из окна подразделения */
    deleteData('#nameSubdivision', 'itemId');
});