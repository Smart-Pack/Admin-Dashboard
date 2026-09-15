# Authentication Pages

Authentication pages handle the different stages of user authentication and account access.

## Forgot Password

Allows users to request a password reset by providing their registered email address. A password reset link is then sent to their email.

## Reset Password

Allows users to set a new password using the password reset link received by email. The reset link contains the required reset credentials and is validated when the password reset request is submitted. If the reset link has expired or is invalid, the user is redirected to the Forgot Password page to request a new reset link.

## Login

Allows users to authenticate using their email address and password. After successful authentication, the user's account information is retrieved and their account type is validated. An OTP is then sent to the user's email, and the user is redirected to the Two-Factor Authentication page to complete verification. If authentication fails, the appropriate error message is displayed.
