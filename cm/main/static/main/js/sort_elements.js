// Сортировка записей
bAlt = true;
document.addEventListener("keydown", function (e) {
    if(e.key == 'Alt'){
        bAlt = false;
    }
});
document.addEventListener("keyup", function (e) {
    if(e.key == 'Alt'){
        bAlt = true;
    }
});

/*  Элементы, которые можно сортировать
    list-group-ID - Сортировка РМов
    sidebar1 - Сортировка разделов
    collapse - Сортировка подразделов. Они добавляются динамически drake.containers.push(container);
*/
drake = dragula(
    [
        document.querySelector("#list-group-ID"),
        document.querySelector("#sidebar1"),
    ],
    {
        invalid: function(el, handle){
            if (bAlt == false){ return false} else { return true}
        },
        accepts: function (el, target, source, sibling) {
            //$('p.out1').text("target= "+target.id+" source= "+source.id); // Перемещать элементы можно только внутри контейнера
            if (target.id == source.id){
                return true; //
            }else{
                return false;
            }
        },
    }
)
.on('drop', function(el){ // Сортировка записей
    if (el.id[0] == 'l') {
        // Сортировка разделов list-unstyled
        const arry_rm = new Array();
        const arry_subsect = new Array();
        let sect_count = document.querySelector(".list-unstyled").childElementCount;
        for (let i = 0; i < sect_count; i++) {
            arry_subsect.push(document.getElementsByClassName("dropdown-toggle")[i].id.replace(/[a-zа-яё_]/gi, ''));
        }
            $.ajax({
            url: '/ajax/',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                j_text: "SortSection",
                j_arry_RM: arry_subsect,
            }),
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            success: function(data){
                //$('p.out1').text(data.result);
                location.reload();
            },error: function(){
                alert("AJAX запрос на сортировку разделов не отправлен!");
            }
        });
    }else if ((el.id[0] == 'r') && (document.querySelector("#addrm").hidden == false))
    {
        // Сортировка РМов
        const arry_rm_text = new Array();
        const arry_rm_HTML = new Array();
        const arry_sort = new Array();
        let rm_count = document.querySelector(".class_list-group").childElementCount;
        for (let i = 0; i < rm_count; i++) {
            arry_rm_HTML[i] = document.getElementsByClassName("class_rm_div")[i].innerHTML;
            arry_rm_text[i] = document.getElementsByClassName("class_rm_div")[i].innerText;
            arry_sort[i] = document.getElementsByClassName("class_rm_div")[i].id.replace(/[a-zа-яё_]/gi, '');
        }
        arry_sort.sort();
        document.getElementById("list-group-ID").innerHTML = "";
        for (let i = 0; i < rm_count; i++) {
            document.getElementById("list-group-ID").innerHTML = document.getElementById("list-group-ID").innerHTML +
            "<li class='list-group-item' id=rm"+arry_sort[i]+">"+
                                "<div style='width: 100%; overflow: hidden;'>"+
                                    "<div style='float: left; height: 100%; width: 75%; padding-right: 20px' class=class_rm_div id=rm_div"+arry_sort[i]+">"+arry_rm_HTML[i]+"</div>"+
                                    "<div style='float: left; height: 100%; width: 25%;'>"+
                                        "<button type=button data-toggle='tooltip' data-trigger='click' title='Скопировано!' class='btn btn-outline-success btn-sm' id=copy_rm"+arry_sort[i]+" onClick=get_btn_copy_id(this)>Копировать</button>&nbsp"+
                                        "<button type=button class='btn btn-outline-warning btn-sm' id=edit_rm"+arry_sort[i]+" onClick=get_btn_edit_id(this)>Edit</button>&nbsp"+
                                        "<button type=button class='btn btn-outline-danger btn-sm' id=del_rm"+arry_sort[i]+" onClick=get_btn_del_id(this)>Del</button>"+
                                    "</div>"+
                                "</div>"+
                        "</li>";
        }
        init_tooltip();
            $.ajax({
            url: '/ajax/',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                j_text: "SortRM",
                j_arry_RM: arry_rm_text,
                j_id: index_sub_ID,
            }),
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            success: function(data){
                //$('p.out1').text(data.result);
            },error: function(){
                alert("AJAX запрос на сортировку РМ не отправлен!");
            }
        });
    }else if (el.id[0] == 'u') // Сортировка подразделов
    {
        const arry_subsect = new Array();
        let sect_count = document.querySelector("#i"+index_section_ID).childElementCount;
        for (let i = 0; i < sect_count; i++) {
            var parent = document.getElementById("i"+index_section_ID);
            var child = parent.getElementsByClassName("aaclass");
            arry_subsect.push(child[i].id.replace(/[a-zа-яё_]/gi, ''));
        }
            $.ajax({
            url: '/ajax/',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                j_text: "SortSubsection",
                j_arry_RM: arry_subsect,
            }),
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            success: function(data){
                //$('p.out1').text(data.result);
                location.reload();
            },error: function(){
                alert("AJAX запрос на сортировку подкатегорий не отправлен!");
            }
        });
    }
});