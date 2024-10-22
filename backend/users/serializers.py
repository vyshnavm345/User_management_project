from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


# this is a first copy
# class UserCreateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ("first_name", "last_name", "email", "password")

#     def validate(self, data):
#         user = User(**data)
#         password = data.get('password')

#         try:
#             validate_password(password, user)
#         except exceptions.ValidationError as e:
#             serializer_errors = serializers.as_serializer_error(e)
#             raise exceptions.ValidationError(
#                 {'password': serializer_errors['non_field_errors']}
#             )

#         return data

#     def create(self, validated_data):
#         user = User.objects.create_user(
#             first_name = validated_data['first_name'],
#             last_name = validated_data['last_name'],
#             email = validated_data['email'],
#             password = validated_data['password']
#         )

#         return user


class UserCreateSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(allow_null=True, required=False)

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "password", "profile_picture")

    def validate(self, data):
        user = User(**data)
        password = data.get("password")

        try:
            validate_password(password, user)
        except exceptions.ValidationError as e:
            serializer_errors = serializers.as_serializer_error(e)
            raise exceptions.ValidationError(
                {"password": serializer_errors["non_field_errors"]}
            )

        return data

    def create(self, validated_data):
        profile_picture = validated_data.pop("profile_picture", None)
        user = User.objects.create_user(**validated_data)

        if profile_picture:
            user.profile_picture = profile_picture
            user.save()

        return user


class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(
        max_length=None, use_url=True, allow_null=True, required=False
    )

    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "profile_picture",
            "is_staff",
        )
