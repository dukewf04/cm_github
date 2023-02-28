(function($) {
	"use strict";

	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });

})(jQuery);
////////////////////////////////////////////
////////////////////////////////////////////

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

//Отображение подсказок title. Необходима при каждом обновлении записей!
function init_tooltip(){
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="tooltip"]').on('mouseleave', function(){
            setTimeout(function (){
                $('[data-toggle="tooltip"]').tooltip('hide');
            }, 300);
        });
    });
}


// [START] Вывод РМ при обновлении страницы
let section_ID;
let index_section_ID;
let sub_ID;
let index_sub_ID;
let check_subsection = true;
let sectionСount; // Количество разделов при старте страницы
if (!document.querySelector(".aaclass")){
    document.querySelector("#addrm").setAttribute('disabled', true);
    document.querySelector("#addrm").innerText = "Ни одна подкатегория не выбрана";
    init_tooltip();
    check_subsection = false;
} else{
    sub_ID = document.querySelector(".aaclass").getAttribute("id"); // Получить ID первой подкатегории при обновлении страницы
    index_sub_ID = sub_ID.replace(/[a-zа-яё_]/gi, ''); // Получить числовой ID первой подкатегории при обновлении страницы
    $('p.p_subsection_name').text(document.getElementById(sub_ID).textContent);
      $.ajax({
        url: "/ajax/",
        type: "POST",
        dataType: "json",
        data: JSON.stringify({'j_text': 'ShowRM', 'j_id': index_sub_ID}),
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        success: (data) => {
            document.getElementById("list-group-ID").innerHTML = data.result;
            init_tooltip();
            //$('p.out1').text("Ответ на вывод РМ получен");
        },
        error: (error) => {
          alert('AJAX запрос на вывод РМ при старте сраницы не отправлен!')
        }
      });
}

// Активировать возможность сортировки элементов внутри подразделов (collapse) при загрузке страницы
subSect_nodes = document.getElementsByClassName("collapse");
sectionСount = subSect_nodes.length;
for (i = 0; i < sectionСount; i++) {
    drake.containers.push(subSect_nodes[i]);
}

bonce = true;
// Получить ID категории
function get_section_ID(obj) {	
    section_ID = String(obj.id);
    index_section_ID = section_ID.replace(/[a-zа-яё_]/gi, '');
}
// Отображение РМ активной подкатегории
function get_subsection_ID(obj) {
    sub_ID = String(obj.id);
    $('p.p_subsection_name').text(document.getElementById(obj.id).textContent);
    index_sub_ID = sub_ID.replace(/[a-zа-яё_]/gi, '');
    document.querySelector("#addrm").hidden = false;
    $.ajax({
        url: "/ajax/",
        type: "POST",
        dataType: "json",
        data: JSON.stringify({'j_text': 'ShowRM', 'j_id': index_sub_ID}),
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        success: (data) => {
            document.getElementById("list-group-ID").innerHTML = data.result;
            init_tooltip();
            //$('p.out1').text("Ответ на вывод РМ получен");
        },
        error: (error) => {
          alert('AJAX запрос на вывод РМ при старте сраницы не отправлен!')
        }
    });
    if(check_subsection == false){
        document.querySelector("#addrm").removeAttribute('disabled');	
        document.querySelector("#addrm").innerText = "Добавить запись";	
        check_subsection = true;
    }
}

// Добавление РМ активной подкатегории
$('#div_modal_add_rm').on('show.bs.modal', function (e) {
    $('#label_modal_add_rm').text(document.getElementById(sub_ID).textContent);
});
$(document).on('click', '#btn_modal_add_rm', function(){
    $.ajax({
        url: "/ajax/",
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            j_text: "AddRM",
            j_text_RM: document.getElementById("textarea_modal_add_rm").value,
            j_id: index_sub_ID,
        }),
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        success: function(data){
            document.getElementById("list-group-ID").innerHTML = document.getElementById("list-group-ID").innerHTML + data.txt_out;
            init_tooltip();
            $('#div_modal_add_rm').modal('hide');
            document.getElementById("textarea_modal_add_rm").value = '';
            //$('p.out1').text(data.result);
        },error: function(){
            alert("AJAX запрос на добавление записи не отправлен!");
        }	
    });	
})		

// Редактирование РМ
let rmID_edit;
function get_btn_edit_id(obj) {			
    $('#div_modal_edit_rm').modal('show');			
    rmID_edit = obj.id;
    document.getElementById("textarea_modal_edit_rm").value = document.getElementById("rm_div"+rmID_edit.replace(/[a-zа-яё_]/gi, '')).innerText;
    //$('p.out1').text(rmID_edit);
}		
$(document).on('click', '#btn_modal_edit_rm', function(){
    $.ajax({
        url: '/ajax/',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            j_text: "EditRM",
            j_text_RM: document.getElementById("textarea_modal_edit_rm").value,
            j_id: rmID_edit.replace(/[a-zа-яё_]/gi, ''),
        }),
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        success: function(data){
            document.getElementById("rm_div"+rmID_edit.replace(/[a-zа-яё_]/gi, '')).innerText = 
                document.getElementById("textarea_modal_edit_rm").value;
            //$('p.out1').text(data.result);
            $('#div_modal_edit_rm').modal('hide');
        },error: function(){
            alert("AJAX запрос на редактирование РМ не отправлен!");
        }	
    });	
});

// Удаление РМ/раздела/записи
let rmID_del;
function get_btn_del_id(obj) {			
    $('#div_modal_del_rm').modal('show');
    rmID_del = obj.id;
}
$(document).on('click', '#btn_modal_del_rm', function(){
    $.ajax({
        url: '/ajax/',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            j_text: "DellRM",
            j_id: rmID_del.replace(/[a-zа-яё_]/gi, ''),
        }),
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        success: function(data){					
            document.querySelector("#rm"+rmID_del.replace(/[a-zа-яё_]/gi, '')).remove();
            //$('p.out1').text(data.result);
            $('#div_modal_del_rm').modal('hide');
        },error: function(){
            alert("AJAX запрос на удаление РМ не отправлен!");
        }	
    });	
});

// Вызов контекстного меню
document.querySelector("#sidebar1").addEventListener("contextmenu", event => { 
        event.preventDefault();
});
document.addEventListener("click", event => {
    if(event.button != 2){
		document.getElementById("dropdown-del-section_finish").style.display = "none";	
        document.getElementById("dropdown-sectionID").style.display = "none";
        document.querySelector('#dropdown-rename-section').value = "";
    }	
});

function getPosition(e) {
  var posx = 0;
  var posy = 0;

  if (!e) var e = window.event;

  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft +
                       document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop +
                       document.documentElement.scrollTop;
  }

  return {
    x: posx,
    y: posy
  }
}


let aID;
function get_sect_id(obj) {	
    aID = obj.id;
    menuPos = getPosition(event);
    menuPosX = menuPos.x;
    menuPosY = menuPos.y;
    document.querySelector("#dropdown-sectionID").style.left = menuPosX + "px";
    document.querySelector("#dropdown-sectionID").style.top = menuPosY + "px";
    document.querySelector(".dropdown-header").innerText = document.querySelector('#'+obj.id).innerText;
    if(obj.id.includes("aa")){ // Контекстное меню подраздел
        document.querySelector("#dropdown-addsub").hidden = true;
		document.getElementById("dropdown-del-section_finish").style.display = "none";
        document.querySelector("#dropdown-del-section").innerText = "Удалить подраздел";
    }else{ // Контекстное меню раздел
        document.querySelector("#dropdown-addsub").hidden = false;	
		document.getElementById("dropdown-del-section_finish").style.display = "none";
        document.querySelector("#dropdown-del-section").innerText = "Удалить раздел";											
    }
    document.getElementById("dropdown-sectionID").style.display = "block";
    $('#dropdown-sectionID').dropdown('show');			
}

$("#dropdown-del-section").on('click', function(){	
	document.getElementById("dropdown-del-section_finish").style.display = "block";	
	$("#dropdown-del-section_finish").on('click', function(){
		if(aID.includes("aa")){ // Удалить подраздел
			$.ajax({
				url: '/ajax/',
				type: 'POST',
				dataType: 'json',
				data: JSON.stringify({
					j_text: "DelSubsection",
					j_id: aID.replace(/[a-zа-яё_]/gi, ''),
					j_text_RM: section_ID.replace(/[a-zа-яё_]/gi, ''),
				}),
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
				success: function(data){
					//$('p.out1').text(data.result);
				},error: function(){
					alert("AJAX запрос на удаление подраздела не отправлен!");
				}	
			});	
		}else{ // Удалить раздел
			$.ajax({
				url: '/ajax/',
				type: 'POST',
				dataType: 'json',
				data: JSON.stringify({
					j_text: "DelSection",
					j_id: aID.replace(/[a-zа-яё_]/gi, ''),
				}),
		        headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
				success: function(data){
					//$('p.out1').text(data.result);
				},error: function(){
					alert("AJAX запрос на удаление раздела не отправлен!");
				}	
			});	
		}
		document.getElementById("dropdown-sectionID").style.display = "none";
		setTimeout(function(){
			location.reload();
		},20);
	})
});

// Копирование записи
function get_btn_copy_id(obj) {
    const str = document.getElementById("rm_div"+obj.id.replace(/[a-zа-яё_]/gi, '')).innerText;
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

// Добавить новый раздел
function addSection(){
    $.ajax({
        url: '/ajax/',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            j_text: "AddSection",
        }),
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        success: function(data){
            //$('p.out1').text(data.result);
            document.getElementById("sidebar1").insertAdjacentHTML('beforeend', data.text_out);
            sectionСount++;
            drake.containers.push(document.getElementsByClassName("collapse")[sectionСount-1]); // Добавляем возможность сортировки в новом разделе
        },error: function(){
            alert("AJAX запрос на создание нового раздела не отправлен!");
        }	
    });				
}

$("#dropdown-addsub").on('click', function(){ // Добавить подраздел
    $.ajax({
        url: '/ajax/',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            j_text: "AddSubsection",
            j_id: aID.replace(/[a-zа-яё_]/gi, ''),
        }),
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        success: function(data){
            //$('p.out1').text(data.result);
            document.getElementById("i"+aID.replace(/[a-zа-яё_]/gi, '')).innerHTML =
                document.getElementById("i"+aID.replace(/[a-zа-яё_]/gi, '')).innerHTML + data.text_out;
        },error: function(){
            alert("AJAX запрос на удаление РМ не отправлен!");
        }
    });
    //$('#dropdown-sectionID').style.display = "none";
    document.getElementById("dropdown-sectionID").style.display = "none";
});

document.querySelector('#dropdown-rename-section').addEventListener('keydown', logKey);
function logKey(e) {
    if(e.key == 'Enter'){
        if(aID.includes("aa")){ // Изменить имя подраздела
            $.ajax({
                url: '/ajax/',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify({
                    j_text: "Edit_Name_Subsection",
                    j_id: aID.replace(/[a-zа-яё_]/gi, ''),
                    j_text_RM: document.querySelector('#dropdown-rename-section').value,
                }),
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
                success: function(data){
                    //$('p.out1').text(data.result);
                            
                },error: function(){
                    alert("AJAX запрос на изменение имени подраздела не отправлен!");
                }	
            });						
        }else{ // Изменить имя раздела
            $.ajax({
                url: '/ajax/',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify({
                    j_text: "Edit_Name_Section",
                    j_id: aID.replace(/[a-zа-яё_]/gi, ''),
                    j_text_RM: document.querySelector('#dropdown-rename-section').value,
                }),
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
                success: function(data){
                    //$('p.out1').text(data.result);
                },error: function(){
                    alert("AJAX запрос на изменение имени раздела не отправлен!");
                }	
            });	
        }
        document.querySelector('#'+aID).innerText = document.querySelector('#dropdown-rename-section').value;
        if(aID.includes("aa") && (aID == sub_ID)){
            $('p.p_subsection_name').text(document.querySelector('#'+aID).innerText);	
        }			
        document.getElementById("dropdown-sectionID").style.display = "none";
        document.querySelector('#dropdown-rename-section').value = "";
    } 			
}

function Search_text(){
    $.ajax({
        url: '/ajax/',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            j_text: "Search_text",
            j_text_RM: document.querySelector('#input_search_text').value,
        }),
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        success: function(data){
            $('p.p_subsection_name').text('Поиск записей');
            document.querySelector('#input_search_text').value = '';
            document.querySelector("#addrm").hidden = true;
            document.getElementById("list-group-ID").innerHTML = data.result;
            init_tooltip();
        },error: function(){
            alert("AJAX запрос на поиск записей не отправлен!");
        }
    });
}
document.querySelector('#input_search_text').addEventListener('keydown', logKey_search);
function logKey_search(e) {
    if(e.key == 'Enter'){
        Search_text();
    }
}

// Сменить аватарку
var input_load = document.getElementById('input_loadfile');
var btn_load = document.getElementById('btn_loadfile');

$('#avatar').on('click', function(){
    input_load.click();
});

$('#input_loadfile').on('change', function(){
    if (input_load.value){
        btn_load.click();
    }
});
