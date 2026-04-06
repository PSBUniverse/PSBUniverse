# Pricing Engine Library

File: src/lib/pricingEngine.js

## Purpose

Centralized quote calculations for gutter pricing and financial rollups.

## Core Calculation Areas

- Gutter quantity per section
- Downspout footage per section
- End-cap grouping totals
- Manufacturer, trip, leaf-guard rate resolution
- Discount application
- Deposit and balance calculations

## Important Rules

- Dynamic section bounds are enforced in calculations.
- Custom override fields can replace setup rates:
  - cstm_manufacturer_rate
  - cstm_trip_rate
  - cstm_leaf_guard_price
  - cstm_discount_percentage
- Deposit uses deposit_percent and is normalized to a 0..1 rate.

## Financial Outputs

The pricing payload includes:

- subtotal
- discountAmount
- projectTotal
- depositAmount
- remainingBalance
- balanceDue
- savingsAmount

## Why It Matters

All UI previews rely on this single source of truth, which avoids duplicated or diverging quote math across pages.
