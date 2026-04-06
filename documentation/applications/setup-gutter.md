# Gutter Setup Application

Route: /setup/gutter

## Purpose

Manage gutter-specific setup reference values.

## Managed Tables

- gtr_s_leaf_guards
- gtr_s_discounts
- gtr_s_trip_rates

## Behavior

- Editable setup table UI with add, edit, remove, save, and cancel.
- Save strategy clears and reinserts cleaned rows.

## Cache Integration

- Uses cached reads for all managed setup tables.
- Invalidates table cache key on save.
- Forces fresh refetch after save.
