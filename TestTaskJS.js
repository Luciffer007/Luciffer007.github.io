"use strict";

$(document).ready(function() { 
        /* Открытие модального окна */
	$('.open-window').click( function(event){ 
		var id = event.target.parentNode.getAttribute('id'); 
                switch (id) {
                    case 'employee':
                        $('#headline').text("Выбор сотрудника");
                        break;
                    case 'position':
                        $('#headline').text("Выбор должности");
                        break;
                    case 'organization':
                        $('#headline').text("Выбор организации");
                        break;
                    case 'subdivision':
                        $('#headline').text("Выбор подразделения");
                        break;
                }
		$('#overlay').fadeIn(400, 
		 	function(){ 
				$('#modal-window') 
					.css('display', 'block') 
					.animate({opacity: 1, top: '50%'}, 200); 
		});
	});
	/* Зaкрытие мoдaльнoгo oкнa, тут делaем тo же сaмoе нo в oбрaтнoм пoрядке */
	$('#close-button, #button-panel div:last-child').click( function(){ 
		$('#modal-window')
			.animate({opacity: 0, top: '45%'}, 200,  
				function(){ 
					$(this).css('display', 'none'); 
					$('#overlay').fadeOut(400); 
				}
			);
	});
});


