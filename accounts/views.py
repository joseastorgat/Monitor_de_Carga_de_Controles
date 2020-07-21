from rest_framework import generics, permissions
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import UserSerializer, LoginSerializer

from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from rest_framework.views import APIView
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.urls import reverse


# Login API 
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        _, token = AuthToken.objects.create(user)
        return Response({
        "user": UserSerializer(user, context=self.get_serializer_context()).data,
        "token": token
        })

# Get User API
class UserAPI(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ] 
    def get_object(self):
        return self.request.user # authenticated user
        

class CustomPasswordResetView:
    @receiver(reset_password_token_created)
    def password_reset_token_created(sender, reset_password_token, *args, **kwargs):
        """
          Handles password reset tokens
          When a token is created, an e-mail needs to be sent to the user
        """
        # send an e-mail to the user
        context = {
            'current_user': reset_password_token.user,
            'username': reset_password_token.user.username,
            'email': reset_password_token.user.email,
            'reset_password_url': "{}?token={}".format("https://ucalendar.dcc.uchile.cl/login/reset/", reset_password_token.key)
        }

        print(f"[RESET PASSWORD REQUEST] { context['username'] } {context['email']} {context['current_user']}")
        
        # # render email text
        # email_html_message = render_to_string('email/user_reset_password.html', context)
        email_plaintext_message = render_to_string('email/user_reset_password.txt', context)

        msg = EmailMultiAlternatives(
            # title:
            "Password Reset for {}".format("U- Calendar"),
            # message:
            email_plaintext_message,
            # from:
            "noreply@{}".format("ucalendar.dcc.uchile.cl"),
            # to:
            [reset_password_token.user.email]
        )
        # msg.attach_alternative(email_html_message, "text/html")
        msg.send()
