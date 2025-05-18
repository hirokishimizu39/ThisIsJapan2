from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """ユーザー情報のシリアライザ"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_image', 
                  'bio', 'native_language', 'japanese_level', 
                  'english_level', 'is_japanese']
        read_only_fields = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    """ユーザー登録用シリアライザ"""
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=False,  # 必須チェックを無効化
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 
                  'native_language', 'japanese_level', 'english_level', 
                  'is_japanese']
    
    def validate(self, data):
        """パスワードの一致を確認"""
        password = data.get('password')
        password_confirm = data.get('password_confirm')
        
        # password_confirmが指定されている場合のみ一致チェックを行う
        if password_confirm and password != password_confirm:
            raise serializers.ValidationError({'password_confirm': _('パスワードが一致しません')})
        return data
    
    def create(self, validated_data):
        """ユーザーを作成"""
        # 確認用パスワードを削除（存在する場合）
        validated_data.pop('password_confirm', None)
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    """ログイン用シリアライザ"""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True,
        style={'input_type': 'password'},
        trim_whitespace=False
    )
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            raise serializers.ValidationError(_('メールアドレスとパスワードを入力してください'))
        
        # ユーザーを検索
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(_('メールアドレスまたはパスワードが正しくありません'))
        
        # 認証
        user = authenticate(
            request=self.context.get('request'),
            username=user.username,  # Djangoのデフォルト認証ではusernameを使用
            password=password
        )
        
        if not user:
            raise serializers.ValidationError(_('メールアドレスまたはパスワードが正しくありません'))
        
        data['user'] = user
        return data

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """カスタムJWTトークンシリアライザ"""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # カスタムクレームを追加
        token['username'] = user.username
        token['email'] = user.email
        token['is_japanese'] = user.is_japanese
        
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # レスポンスにユーザー情報を追加
        user_serializer = UserSerializer(self.user)
        data['user'] = user_serializer.data
        
        return data

class UserUpdateSerializer(serializers.ModelSerializer):
    """ユーザー情報更新用シリアライザ"""
    
    class Meta:
        model = User
        fields = ['username', 'profile_image', 'bio', 
                  'native_language', 'japanese_level', 
                  'english_level', 'is_japanese']
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance 