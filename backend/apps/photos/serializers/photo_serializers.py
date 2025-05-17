from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.photos.models import Photo
from apps.common.models import Category, Tag

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    写真投稿者情報を表示するための簡易シリアライザ
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'profile_image']


class CategorySerializer(serializers.ModelSerializer):
    """
    カテゴリ情報を表示するためのシリアライザ
    """
    class Meta:
        model = Category
        fields = ['id', 'name']


class TagSerializer(serializers.ModelSerializer):
    """
    タグ情報を表示するためのシリアライザ
    """
    class Meta:
        model = Tag
        fields = ['id', 'name']


class PhotoSerializer(serializers.ModelSerializer):
    """
    写真一覧用のシリアライザ
    """
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Photo
        fields = [
            'id', 'title', 'description', 'image', 'user',
            'location_name', 'created_at', 'slug', 'views_count'
        ]


class PhotoDetailSerializer(serializers.ModelSerializer):
    """
    写真詳細用のシリアライザ
    """
    user = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    
    class Meta:
        model = Photo
        fields = [
            'id', 'title', 'description', 'image', 'user',
            'category', 'tags', 'location_name', 'latitude', 'longitude',
            'created_at', 'updated_at', 'slug', 'is_published', 'views_count'
        ]


class PhotoCreateSerializer(serializers.ModelSerializer):
    """
    写真作成用のシリアライザ
    """
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        required=False,
        write_only=True,
        source='category'
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        required=False,
        write_only=True,
        many=True
    )
    
    class Meta:
        model = Photo
        fields = [
            'title', 'description', 'image',
            'category_id', 'tag_ids', 'location_name', 'latitude', 
            'longitude', 'is_published'
        ]
    
    def validate(self, data):
        """
        画像が必須であることを検証
        """
        if not self.initial_data.get('image'):
            raise serializers.ValidationError({
                'image': ['画像ファイルのアップロードが必須です']
            })
            
        return data
    
    def create(self, validated_data):
        """
        写真を作成して関連するタグを設定する
        """
        tag_ids = validated_data.pop('tag_ids', [])
        photo = Photo.objects.create(
            user=self.context['request'].user,
            **validated_data
        )
        
        # タグの設定
        if tag_ids:
            photo.tags.set(tag_ids)
            
        return photo


class PhotoUpdateSerializer(serializers.ModelSerializer):
    """
    写真更新用のシリアライザ
    """
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        required=False,
        write_only=True,
        source='category'
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        required=False,
        write_only=True,
        many=True
    )
    
    class Meta:
        model = Photo
        fields = [
            'title', 'description', 'image',
            'category_id', 'tag_ids', 'location_name', 'latitude', 
            'longitude', 'is_published'
        ]
    
    def update(self, instance, validated_data):
        """
        写真を更新して関連するタグを設定する
        """
        tag_ids = validated_data.pop('tag_ids', None)
        
        # インスタンスの更新
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # タグの設定（指定されている場合のみ）
        if tag_ids is not None:
            instance.tags.set(tag_ids)
            
        return instance 