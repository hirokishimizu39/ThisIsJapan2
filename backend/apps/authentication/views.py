from django.shortcuts import render
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    CustomTokenObtainPairSerializer,
    UserUpdateSerializer
)

User = get_user_model()

class RegisterAPIView(APIView):
    """ユーザー登録API"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # ユーザー情報をシリアライズして返す
            return Response(
                UserSerializer(user).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    """カスタムトークン取得ビュー"""
    serializer_class = CustomTokenObtainPairSerializer

class LoginAPIView(APIView):
    """ログインAPI"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # JWTトークンを生成
            refresh = RefreshToken.for_user(user)
            
            response_data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

class LogoutAPIView(APIView):
    """ログアウトAPI"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # クライアントから受け取ったリフレッシュトークン
            refresh_token = request.data.get('refresh')
            if refresh_token:
                # トークンをブラックリストに追加
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class UserAPIView(APIView):
    """現在のユーザー情報を取得するAPI"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
