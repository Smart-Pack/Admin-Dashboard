# User Management

The User Management page provides administrators with a central place to manage platform users.

## Overview

The page supports:

- Viewing users
- Filtering users by role and status
- Adding new users
- Viewing individual user details

## Navigation

User Management is accessible from the dashboard sidebar through the **User Management** menu item.

The section includes:

- **Users** — the main user management page
- **User Details** — the details view for an individual user

## User Management Workflow

The main page displays the list of users and provides actions for managing them.

Administrators can switch between the user list and the user creation form using the **Add User** and **Cancel** actions.

The users table provides filtering by:

- All users
- Administrators
- Staff
- Suspended users

Each user also has a **View** action for accessing their details.

## Routes

| Route | Purpose |
| --- | --- |
| `/dashboard/users` | User management page |
| `/dashboard/users/:id/details` | Individual user details |

## Related Areas

- Dashboard sidebar navigation
- User list and filtering
- User creation
- User details
