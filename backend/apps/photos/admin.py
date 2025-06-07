from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import Photo

# Register your models here.
@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'image', 'created_at')
    list_filter = ('user', 'created_at')
    search_fields = ('user__username',)
    readonly_fields = ('created_at', 'updated_at')

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')
    
    def image_tag(self, obj):
        return mark_safe(f'<img src="{obj.image.url}" style="width: 100px; height: 100px;" />')
    image_tag.short_description = 'Image'
    image_tag.allow_tags = True
