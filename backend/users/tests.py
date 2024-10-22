from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import UserAccount


class UserAccountTests(APITestCase):
    def setUp(self):
        self.register_url = reverse("register")
        self.user = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",  # Use unique email for registration
            "password": "testpassword123",
        }
        # Create a user instance
        self.user_instance = UserAccount.objects.create_user(**self.user)

        # Create JWT token for the user
        refresh = RefreshToken.for_user(self.user_instance)
        self.access_token = str(refresh.access_token)

    def test_user_registration(self):
        new_user_data = {
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane.smith@example.com",  # Different email for registration
            "password": "newpassword123",
        }
        response = self.client.post(self.register_url, new_user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserAccount.objects.count(), 2)  # 1 existing user + 1 new user
        self.assertEqual(
            UserAccount.objects.get(email="jane.smith@example.com").first_name, "Jane"
        )

    def test_retrieve_user(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        response = self.client.get(reverse("me"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["first_name"], self.user["first_name"])

    def test_update_user(self):
        self.client.login(username=self.user["email"], password=self.user["password"])
        update_data = {
            "id": self.user_instance.id,  # Ensure user ID is included
            "first_name": "Jane",
        }

        response = self.client.put(
            reverse("updateUser"), data=update_data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Refresh user instance from the database to verify the update
        self.user_instance.refresh_from_db()
        self.assertEqual(self.user_instance.first_name, "Jane")

    def test_delete_user(self):
        self.client.login(username=self.user["email"], password=self.user["password"])
        response = self.client.post(
            reverse("deleteUser"), {"id": self.user_instance.id}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(UserAccount.objects.count(), 0)  # User should be deleted

    def test_user_list(self):
        # self.client.login(username=self.user['email'], password=self.user['password'])
        response = self.client.get(reverse("allUsers"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)
