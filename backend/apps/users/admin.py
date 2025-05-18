from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

User = get_user_model()

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """カスタムユーザーモデルの管理画面"""
    list_display = ('username', 'email', 'is_japanese', 'is_staff', 'is_active')
    list_filter = ('is_japanese', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        (_('個人情報'), {'fields': ('profile_image', 'bio')}),
        (_('言語情報'), {'fields': ('native_language', 'japanese_level', 'english_level', 'is_japanese')}),
        (_('権限'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('重要な日付'), {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
    )
    
    readonly_fields = ('last_login', 'date_joined', 'created_at', 'updated_at')
