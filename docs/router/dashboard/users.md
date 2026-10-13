# User Management

The User Management section provides administrators and authorized users with a central place to view and manage platform users, including their associated SmartPacks and groups.

## Overview

The section supports:

- Viewing users
- Filtering users by role and status
- Adding new users (administrators only)
- Viewing individual user details
- Updating user information (administrators only)
- Suspending or activating users (administrators only)
- Viewing a user's assigned SmartPacks
- Viewing groups associated with a user
- Filtering a user's groups by membership role

## Navigation

User Management is accessible from the dashboard sidebar through the **User Management** menu item.

The section includes:

- **Users** — the main user management page
- **User Details** — the details view for an individual user

## User Management Workflow

The main page displays the list of users and provides user management actions.

Administrators can switch between the user list and the user creation form using the **Add User** and **Cancel** actions.

Non-administrative users can view the user list but do not have access to the **Add User** action.

The users table provides filtering by:

- All users
- Administrators
- Staff
- Suspended users

Each user has a **View** action for accessing their details.

## User Details

The User Details page displays the selected user's profile and account information, including their associated SmartPacks and groups.

### User Profile

Administrators can:

- Update the user's information
- Suspend an active user
- Activate a suspended user

The **Suspend/Activate** action is disabled when viewing the currently logged-in user's account to prevent users from suspending or activating their own account.

Non-administrative users can view user details but do not have access to administrative actions.

### User Assets

The **Assets** section provides administrators with a way to view the SmartPacks and groups associated with a selected user.

Administrators can switch between the two views using the **Show Groups** and **Show SmartPacks** buttons.

#### SmartPacks

The SmartPacks view displays the SmartPacks assigned to the selected user.

The table includes:

- **IMEI** — the device's International Mobile Equipment Identity
- **Hardware Model** — the SmartPack hardware model
- **Firmware** — the device firmware version
- **Status** — the device's connectivity status
- **Assigned To** — the assigned user's details
- **Added** — when the SmartPack was added
- **Actions** — a **View** action for accessing SmartPack details

The table supports searching and filtering through its available tabs.

#### Groups

The Groups view displays groups associated with the selected user.

The table includes:

- **Group Name** — the group's name
- **Total Users** — the number of users associated with the group
- **Total SmartPacks** — the number of SmartPacks associated with the group
- **Created** — when the group was created
- **Actions** — a **View** action for accessing group details

The Groups table provides the following filters:

| Filter | Description |
|---|---|
| **All** | Displays all groups the selected user belongs to. |
| **Owner** | Displays groups where the selected user is the owner. |
| **Member** | Displays groups where the selected user has the regular member role. |

The group list is filtered using the selected user's ID, ensuring that the displayed groups are associated with that user.

Administrators can select **View** to navigate to the individual group's details page.

## Routes

| Route | Purpose |
|---|---|
| `/dashboard/users` | User management page |
| `/dashboard/users/:id/details` | Individual user details |
| `/dashboard/smartpacks/:id/details` | SmartPack details |
| `/dashboard/groups/:id/details` | Group details |

## Related Areas

- Dashboard sidebar navigation
- User list and filtering
- User creation
- User details
- User account updates
- User suspension and activation
- User-associated SmartPacks
- User-associated groups
- Group membership and roles
- SmartPack management
