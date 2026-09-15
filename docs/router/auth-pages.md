# Authentication Pages

Authentication pages handle the different stages of user authentication and account access.

## Forgot Password

Allows users to request a password reset by providing their registered email address. A password reset link is then sent to their email.

## Reset Password

Allows users to set a new password using the password reset link received by email. The reset link contains the required reset credentials and is validated when the password reset request is submitted. If the reset link has expired or is invalid, the user is redirected to the Forgot Password page to request a new reset link.
