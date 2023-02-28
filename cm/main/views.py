# - Подвинуть кусок кода: Tab, Shift+Tab
# - Закомитить кусок кода: CTRL + '/'

import json

from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import Section, Subsection, Speechmodules, Avatar
from django.contrib.auth.decorators import login_required


@login_required(login_url='login')
def index_page(request):
    sect = Section.objects.order_by('order')
    subsect = Subsection.objects.order_by('order')
    user_photo = None
    try:
        user_photo = Avatar.objects.get(userInfo=request.user)
    except: #Пользователь новый
        photoName = str(request.user) + '_photo'
        Avatar.objects.create(name=photoName, userInfo=request.user)
        user_photo = Avatar.objects.get(userInfo=request.user)

    # Загрузка фото
    if request.method == 'POST':
        image = request.FILES.get('userfile')
        try:
            photo = Avatar.objects.get(userInfo=request.user)
            photo.image = image
            photo.save()
            print('Avatar.objects.get')
            return redirect('home')
        except:
            photoName = str(request.user) + '_photo'
            Avatar.objects.create(name=photoName, image=image, userInfo=request.user)
            return redirect('home')

    context = {
        'sect': sect,
        'subsect': subsect,
        'user_photo': user_photo,
    }
    return render(request, 'index.html', context=context)

# Отображение блока кнопок
def show_div_btn(str_id, str_text):
    txt_out = f"""  <li class='list-group-item' id=rm{str_id}>
                    <div style='width: 100%; overflow: hidden;'>
                    <div style='float: left; height: 100%; width: 75%; padding-right: 20px' class=class_rm_div id=rm_div{str_id}>{str_text}</div>
                    <div style='float: left; height: 100%; width: 25%;'>
                    <button type=button data-toggle='tooltip' data-trigger='click' title='Скопировано!' class='btn btn-outline-success btn-sm' id=copy_rm{str_id} onClick=get_btn_copy_id(this)>Копировать</button>&nbsp
                    <button type=button class='btn btn-outline-warning btn-sm' id=edit_rm{str_id} onClick=get_btn_edit_id(this)>Edit</button>&nbsp
                    <button type=button class='btn btn-outline-danger btn-sm' id=del_rm{str_id} onClick=get_btn_del_id(this)>Del</button>
                    </div>
                    </div>
                    </li>
               """
    return txt_out

def get_ajax(request):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    if is_ajax and request.method == 'POST':
        #if request.method == 'POST':
        data = json.load(request)
        txt_out = ''
        # Вывод РМ при обнловлении страницы
        if data['j_text'] == 'ShowRM':
            speech_m = Speechmodules.objects.filter(subsection_id=data['j_id'], userInfo=request.user)
            for el in speech_m:
                text_with_br = el.text.replace('\n', '<br>')
                txt_out += show_div_btn(el.id, text_with_br)
            return JsonResponse({'result': txt_out})

        # Добавление РМ активной подкатегории. Вывод РМ при обнловлении страницы
        if data['j_text'] == 'AddRM':
            Speechmodules.objects.create(subsection_id=data['j_id'], text=data['j_text_RM'], userInfo=request.user)
            speech_m = Speechmodules.objects.all().last()
            text_with_br = speech_m.text.replace('\n', '<br>')
            txt_out += show_div_btn(speech_m.id, text_with_br)
            return JsonResponse({'result': 'Новая запись успешно добавлена!', 'txt_out': txt_out})

        # Редактирование РМ
        if data['j_text'] == 'EditRM':
            text_to_change = Speechmodules.objects.get(id=data['j_id'])
            text_to_change.text = data['j_text_RM']
            text_to_change.save()
            return JsonResponse({'result': 'Запись обновлена!'})

        # Удаление РМ
        if data['j_text'] == 'DellRM':
            Speechmodules.objects.get(id=data['j_id']).delete()
            return JsonResponse({'result': 'Запись удалена'})

        # Удалить подраздел
        if data['j_text'] == 'DelSubsection':
            Subsection.objects.get(id=data['j_id']).delete()
            if Subsection.objects.filter(section_id=data['j_text_RM'], userInfo=request.user).count() == 0:
                 Section.objects.get(id=data['j_text_RM']).delete()
            return JsonResponse({'result': f"Подраздел {data['j_id']} удален из категории {data['j_text_RM']}"})

        # Удалить раздел
        if data['j_text'] == 'DelSection':
            Section.objects.get(id=data['j_id']).delete()
            return JsonResponse({'result': f"Раздел {data['j_id']} удален!"})

        # Добавить новый раздел
        if data['j_text'] == 'AddSection':
            Section.objects.create(name='Новый раздел', userInfo=request.user)
            new_sect_order = Section.objects.all().last()
            new_sect_order.order = new_sect_order.id
            new_sect_order.save()
            Subsection.objects.create(name='Новый подраздел', section_id=new_sect_order.id, userInfo=request.user)
            new_subsect_order = Subsection.objects.all().last()
            new_subsect_order.order = new_subsect_order.id
            new_subsect_order.save()
            text_out = f"""<li id=li{new_sect_order.id}><a href=#i{new_sect_order.id} onClick=get_section_ID(this)
                           oncontextmenu=get_sect_id(this) data-toggle=collapse aria-expanded=false class='dropdown-toggle'
                           id=a{new_sect_order.id}>{new_sect_order.name}</a>
                           <ul class='collapse list-unstyled' data-parent=#sidebar1 id=i{new_sect_order.id}>
                           <li class=leftsub id=u{new_subsect_order.id}><a href=# onClick=get_subsection_ID(this) class=aaclass
                           id=aa{new_subsect_order.id} oncontextmenu=get_sect_id(this)>{new_subsect_order.name}</a></li></ul></li>
                       """
            return JsonResponse({'result': 'Новый раздел создан', 'text_out': text_out})

        # Добавить новый подраздел
        if data['j_text'] == 'AddSubsection':
            Subsection.objects.create(name='Новый подраздел', section_id=data['j_id'], userInfo=request.user)
            new_subsect_order = Subsection.objects.all().last()
            new_subsect_order.order = new_subsect_order.id
            new_subsect_order.save()
            text_out = f"""<li class=leftsub id=u{new_subsect_order.id}><a href=# onClick=get_subsection_ID(this)
                           class=aaclass id=aa{new_subsect_order.id} oncontextmenu=get_sect_id(this)>{new_subsect_order.name}</a></li>
                       """
            return JsonResponse({'result': 'Новый подраздел создан', 'text_out': text_out})

        # Изменить имя раздела
        if data['j_text'] == 'Edit_Name_Section':
            new_sect_name = Section.objects.get(id=data['j_id'])
            new_sect_name.name = data['j_text_RM']
            new_sect_name.save()
            return JsonResponse({'result': 'Имя раздела успешно изменено!'})

    # Изменить имя подраздела
    if data['j_text'] == 'Edit_Name_Subsection':
        new_subsect_name = Subsection.objects.get(id=data['j_id'])
        new_subsect_name.name = data['j_text_RM']
        new_subsect_name.save()
        return JsonResponse({'result': 'Имя подраздела успешно изменено!'})

    # Сортировка разделов
    if data['j_text'] == 'SortSection':
        j = 0
        for el in data['j_arry_RM']:
            sect_new_order = Section.objects.get(id=el)
            sect_new_order.order = j
            sect_new_order.save()
            j += 1
        return JsonResponse({'result': 'Разделы отсортированы!'})

    # Сортировка подразделов
    if data['j_text'] == 'SortSubsection':
        j = 0
        for el in data['j_arry_RM']:
            subsect_new_order = Subsection.objects.get(id=el)
            subsect_new_order.order = j
            subsect_new_order.save()
            j += 1
        return JsonResponse({'result': 'Подразделы отсортированы!'})

    # Сортировка РМов
    if data['j_text'] == 'SortRM':
        get_speech = Speechmodules.objects.filter(subsection_id=data['j_id'], userInfo=request.user)
        i = 0
        for el in get_speech:
            el.text = data['j_arry_RM'][i]
            i += 1
            el.save()
        return JsonResponse({'result': 'Записи отсортированы!'})

    # Поиск записей
    if data['j_text'] == 'Search_text':
        txt_out = ''
        search_record = Speechmodules.objects.filter(userInfo=request.user)
        for el in search_record:
            txt_find = el.text.lower().find(data['j_text_RM'].lower())
            if txt_find != -1:
                text_with_br = el.text
                text_with_br = text_with_br[:txt_find] + "<span style='color: blue; font-weight: bold;'>" + \
                               text_with_br[txt_find:txt_find+len(data['j_text_RM'])] + "</span>" + text_with_br[txt_find+len(data['j_text_RM']):]
                text_with_br = text_with_br.replace('\n', '<br>')
                txt_out += show_div_btn(el.id, text_with_br)
        if len(txt_out) == 0:
            txt_out = '<h3>Записи не найдены</h3>'
        return JsonResponse({'result': txt_out})

    # # Загрузка фото. Аватарка
    # if data['j_text'] == 'LoadAvatar':
    #     data = request.post
    #     image = request.FILE.get('userfile')
    #     photo = Avatar.objects.create(name='photo', image=data['j_text_RM'], userInfo=request.user)
    #     #print('data: ', data)
    #     #print('image: ', image)
    #     return JsonResponse({'result': 'Файл успешно передан!'})

    else:
        return JsonResponse({'result': 'Ошибка при взаимодействии с базой данных!'})

# Загрузка фото
