from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .serializers import UserCreateSerializer, UserSerializer
from .models import UserAccount
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404


class RegisterView(APIView):
    def post(self, request):
        data = request.data
        print("data: ", data)
        
        serializer = UserCreateSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = serializer.create(serializer.validated_data)
        user = UserSerializer(user)
        
        return Response(user.data, status=status.HTTP_201_CREATED)


class RetriveUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        user = UserSerializer(user)
        
        return Response(user.data, status=status.HTTP_200_OK)


    
@api_view(['GET'])
def RetriveUserListView(request):

    search_term = request.GET.get('search', '')
    if search_term:
        users = UserAccount.objects.filter(
            Q(first_name__icontains=search_term) |
            Q(last_name__icontains=search_term) |
            Q(email__icontains=search_term)
        )
    else:
        users = UserAccount.objects.all()

    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
def edit_user(request):
    print("Request : ", request)
    data = request.data
    user_id = data.get('id')
    user = UserAccount.objects.get(id=user_id)
    print("user : ",user)
    
    serializer = UserSerializer(user, data=data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({'message':'Update successfull'}, status=status.HTTP_200_OK) 

    else:
        print(serializer.errors)
        return Response({'message':'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST) 

    
@api_view(['POST'])
def delete_user(request):
    data = request.data
    user_id = data.get('id')
    
    print("request.data : ", data)
    
    try:
        user = get_object_or_404(UserAccount, id=user_id)
        print("User: ", user)
        deleted_user_id = user.id  # Get the ID before deletion
        user.delete()
        return Response({'deleted_user_id': deleted_user_id}, status=status.HTTP_200_OK)
    except UserAccount.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)