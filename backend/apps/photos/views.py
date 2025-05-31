from django.shortcuts import render
from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import Photo
from .serializers import (
    PhotoSerializer,
    PhotoDetailSerializer,
    PhotoCreateSerializer,
    PhotoUpdateSerializer
)


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    オブジェクトの所有者だけが編集できるようにするパーミッション
    """
    def has_object_permission(self, request, view, obj):
        # 読み取りのリクエストはすべて許可
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # 書き込みのリクエストは所有者のみ許可
        return obj.user == request.user


class PhotoListAPIView(generics.ListAPIView):
    """
    写真一覧を取得するAPI
    
    クエリパラメータ:
    - search: タイトルと説明を検索
    - category: カテゴリIDでフィルタリング
    - user: ユーザーIDでフィルタリング
    - location: 位置情報でフィルタリング
    - tags: タグIDでフィルタリング（カンマ区切りで複数指定可能）
    - ordering: 並び順（created_at, -created_at, views_count, -views_count）
    """
    serializer_class = PhotoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'user', 'location_name']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'views_count']
    ordering = ['-created_at']
    
    def get_queryset(self):
        # 開発環境での一時的な修正: すべての写真を公開状態に設定
        if hasattr(self, '_photos_published'):
            pass  # 既に実行済み
        else:
            # データベース内のすべての写真を公開状態に設定
            Photo.objects.filter(is_published=False).update(is_published=True)
            self._photos_published = True
            print(f"Updated unpublished photos to published status")
        
        queryset = Photo.objects.filter(is_published=True)
        
        # タグによるフィルタリング
        tags = self.request.query_params.get('tags')
        if tags:
            tag_ids = tags.split(',')
            queryset = queryset.filter(tags__id__in=tag_ids).distinct()
            
        return queryset
    
    def get_serializer_context(self):
        """シリアライザにリクエストコンテキストを渡す"""
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context


class UserPhotoListAPIView(generics.ListAPIView):
    """
    ログインユーザーの写真一覧を取得するAPI
    """
    serializer_class = PhotoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Photo.objects.filter(user=self.request.user)
    
    def get_serializer_context(self):
        """シリアライザにリクエストコンテキストを渡す"""
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context


class PhotoDetailAPIView(generics.RetrieveAPIView):
    """
    写真の詳細を取得するAPI
    """
    queryset = Photo.objects.all()
    serializer_class = PhotoDetailSerializer
    lookup_field = 'slug'
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # 閲覧回数をインクリメント
        instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def get_serializer_context(self):
        """シリアライザにリクエストコンテキストを渡す"""
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context


class PhotoCreateAPIView(generics.CreateAPIView):
    """
    写真を作成するAPI
    """
    serializer_class = PhotoCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def perform_create(self, serializer):
        serializer.save()


class PhotoUpdateAPIView(generics.UpdateAPIView):
    """
    写真を更新するAPI
    """
    queryset = Photo.objects.all()
    serializer_class = PhotoUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    lookup_field = 'slug'


class PhotoDeleteAPIView(generics.DestroyAPIView):
    """
    写真を削除するAPI
    """
    queryset = Photo.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    lookup_field = 'slug'


class PhotoTogglePublishAPIView(APIView):
    """
    写真の公開/非公開を切り替えるAPI
    """
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    
    def post(self, request, slug):
        try:
            photo = Photo.objects.get(slug=slug, user=request.user)
            photo.is_published = not photo.is_published
            photo.save(update_fields=['is_published'])
            return Response({
                'status': 'success',
                'is_published': photo.is_published
            })
        except Photo.DoesNotExist:
            return Response({
                'status': 'error',
                'message': '写真が見つかりません'
            }, status=status.HTTP_404_NOT_FOUND)
