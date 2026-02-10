# Local Storage Strategy

## Overview
This document defines the client-side local storage approach for caching data, managing offline state, and improving user experience without relying on backend storage for ephemeral data.

## Storage Keys & Versioning

### Key Naming Convention
Format: `app_<feature>_<version>`

Example: `app_recentlyViewed_v1`

### Version Management
- Each key includes version suffix
- Allows migration when data structure changes
- Old versions can be cleaned up on app load

## Stored Data Categories

### 1. Recently Viewed Items

**Key**: `app_recentlyViewed_v1`

**Purpose**: Track products user has viewed for quick access and recommendations

**Data Structure**:
