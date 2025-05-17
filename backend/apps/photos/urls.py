from django.urls import path
from . import views

app_name = 'photos'

urlpatterns = [
    # 写真一覧
    path('', views.PhotoListAPIView.as_view(), name='photo-list'),
    
    # ユーザー自身の写真一覧
    path('my/', views.UserPhotoListAPIView.as_view(), name='my-photos'),
    
    # 写真作成
    path('create/', views.PhotoCreateAPIView.as_view(), name='photo-create'),
    
    # 写真詳細・更新・削除
    path('<slug:slug>/', views.PhotoDetailAPIView.as_view(), name='photo-detail'),
    path('<slug:slug>/update/', views.PhotoUpdateAPIView.as_view(), name='photo-update'),
    path('<slug:slug>/delete/', views.PhotoDeleteAPIView.as_view(), name='photo-delete'),
    
    # 公開状態の切り替え
    path('<slug:slug>/toggle-publish/', views.PhotoTogglePublishAPIView.as_view(), name='photo-toggle-publish'),
] 