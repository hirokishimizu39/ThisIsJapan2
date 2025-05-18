from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    """カスタムユーザーマネージャー"""
    
    def create_user(self, username, email, password=None, **extra_fields):
        """通常ユーザーを作成"""
        if not email:
            raise ValueError(_('メールアドレスは必須です'))
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, email, password=None, **extra_fields):
        """スーパーユーザーを作成"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('スーパーユーザーはis_staff=Trueである必要があります'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('スーパーユーザーはis_superuser=Trueである必要があります'))
        
        return self.create_user(username, email, password, **extra_fields)

class User(AbstractUser):
    """カスタムユーザーモデル"""
    
    # 言語関連のフィールド
    LANGUAGE_CHOICES = [
        ('japanese', '日本語'),
        ('english', '英語'),
        ('chinese', '中国語'),
        ('korean', '韓国語'),
        ('french', 'フランス語'),
        ('german', 'ドイツ語'),
        ('spanish', 'スペイン語'),
        ('other', 'その他'),
    ]
    
    LANGUAGE_LEVELS = [
        ('none', '学習経験なし'),
        ('beginner', '少しわかる（初心者レベル）'),
        ('daily', '日常会話レベル'),
        ('business', 'ビジネスレベル'),
        ('native', 'ネイティブレベル'),
    ]
    
    email = models.EmailField(_('メールアドレス'), unique=True)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    bio = models.TextField(_('自己紹介'), blank=True)
    
    # 言語関連の属性
    native_language = models.CharField(
        _('母国語'),
        max_length=50,
        choices=LANGUAGE_CHOICES,
        default='japanese'
    )
    japanese_level = models.CharField(
        _('日本語レベル'),
        max_length=20,
        choices=LANGUAGE_LEVELS,
        default='none'
    )
    english_level = models.CharField(
        _('英語レベル'),
        max_length=20,
        choices=LANGUAGE_LEVELS,
        default='none'
    )
    is_japanese = models.BooleanField(_('日本人フラグ'), default=True)
    
    # タイムスタンプ（既存のものを上書き）
    created_at = models.DateTimeField(_('作成日時'), auto_now_add=True)
    updated_at = models.DateTimeField(_('更新日時'), auto_now=True)
    
    # カスタムマネージャーを設定
    objects = UserManager()
    
    # ユーザー名の代わりにメールアドレスを使用する場合は以下を設定
    # USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = ['username']
    
    class Meta:
        verbose_name = _('ユーザー')
        verbose_name_plural = _('ユーザー')
        
    def __str__(self):
        return self.username
