from django.conf import settings
from django.db import models

class Section(models.Model):
    name = models.CharField(max_length=50, blank=False)
    order = models.IntegerField(default=0, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, name='userInfo', null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Разделы'


class Subsection(models.Model):
    section = models.ForeignKey(Section, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=50, blank=False)
    order = models.IntegerField(default=0, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, name='userInfo', null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Подразделы'


class Speechmodules(models.Model):
    #section = models.IntegerField(blank=False)
    subsection = models.ForeignKey(Subsection, on_delete=models.CASCADE, null=True)
    text = models.TextField(default='')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, name='userInfo', null=True)

    def __str__(self):
        return self.text

    class Meta:
        verbose_name_plural = 'Речевые модули'

class Avatar(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    image = models.ImageField(null=True, blank=True, default='noPhoto.jpg')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, name='userInfo', null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Фото пользователя'