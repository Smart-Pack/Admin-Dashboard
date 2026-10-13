# Group Details Page

## Overview

The Group Details page displays information about an individual group, including its metadata, ownership, membership count, and associated SmartPacks.

## Group Information

The summary section displays:
- Group name.
- Total number of members.
- Total number of associated SmartPacks.

The details section displays:
- **Group Name:** The name of the group.
- **Owner:** The full name of the group owner, or a fallback message if no owner is assigned.
- **Created:** The group's creation date and time, formatted using the application's date-time filter.

## Group Assets

The page includes a Group Assets section when a valid group ID is available.

The section receives the following properties:
- `groupId`: The group's unique identifier.
- `groupName`: The group's name.
- `refreshKey`: The group's last-updated timestamp, used to trigger asset refreshes when appropriate.

Group assets include members and associated SmartPacks.

## Data Fetching

The page retrieves group details using the group ID provided in the route parameters.

- On mounting, the page requests the group's details through the groups API.
- If the request fails, an error notification is displayed.
- If the error indicates that the page should be reloaded, the user is redirected to the Groups list.

## Fallbacks

- If the group name is unavailable, the summary displays `Group`.
- If no owner is assigned, the owner field displays `No owner assigned`.
- If the creation timestamp is unavailable, the page displays `—`.
- If the group has no valid ID, the Group Assets section is not rendered.
