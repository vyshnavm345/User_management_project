from django.urls import path

from .views import (
    RegisterView,
    RetriveUserListView,
    RetriveUserView,
    delete_user,
    edit_user,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", RetriveUserView.as_view(), name="me"),
    path("allUsers/", RetriveUserListView, name="allUsers"),
    path("deleteUser/", delete_user, name="deleteUser"),
    path("updateUser/", edit_user, name="updateUser"),
]
