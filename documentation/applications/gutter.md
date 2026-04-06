# Gutter Application

Routes:

- /gutter
- /gutter/new
- /gutter/[id]
- /gutter/[id]/work-order

## Purpose

Manage gutter quote projects from listing through pricing and work-order preview.

## /gutter (Project List)

- Loads project list and status setup values.
- Supports status updates and project deletion.
- Uses cache keys:
  - projects:list
  - setup:statuses
- Invalidates project cache keys after update/delete and forces fresh reload.

## /gutter/new (Create)

- Loads setup reference tables (status, colors, manufacturers, leaf guard, trip rates, discounts).
- Captures dynamic section rows with min/max constraints.
- Captures optional extras, discount, leaf guard, and manual override values.
- Persists:
  - header to gtr_t_projects
  - sections to gtr_m_project_sides
  - extras to gtr_m_project_extras
- Writes deposit_percent on header.
- Invalidates project-related cache keys after save.

## /gutter/[id] (Edit)

- Loads header + section + extras rows by project id.
- Maps custom override columns to edit UI state.
- Supports full header/child rewrite on save.
- Writes deposit_percent on update.
- Invalidates and refetches cached project data after save.

## /gutter/[id]/work-order

- Reads project and section data for printable install context.
- Work-order notes are currently not persisted because no dedicated storage table/columns are implemented.

## Pricing Integration

Both new and edit pages call src/lib/pricingEngine.js for live quote preview.

Key outputs shown in preview include:

- Subtotal
- Discount amount
- Project total
- Deposit amount (from deposit_percent)
- Remaining balance
