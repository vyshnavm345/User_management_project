from django.urls import path
from .views import RegisterView,  RetriveUserView, RetriveUserListView, delete_user, edit_user

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('me/', RetriveUserView.as_view()),
    path('allUsers/', RetriveUserListView),
    path("deleteUser/", delete_user),
    path("updateUser/", edit_user)
]