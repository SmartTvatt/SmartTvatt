# Project Log — Ellen

## Work so far
- Focused on backend infrastructure, database configuration, user authentication, and secure account management flows for SmartTvätt.
- Developed backend REST API endpoints, Express controllers, and password reset logic before building corresponding frontend components to integrate seamlessly with team members' existing UI layouts.
- Provisioned and connected the cloud database using MongoDB Atlas, setting up user schemas, auth tokens, and database indexes.
- Implemented global `AuthContext` with persistent session handling and role-based `ProtectedRoute` guards for route authorization ([PR #54](https://github.com/SmartTvatt/SmartTvatt/pull/54)).
- Built multi-language support (SV/EN) and localized input validation for authentication forms ([PR #57](https://github.com/SmartTvatt/SmartTvatt/pull/57)).
- Implemented customizable tenant logo upload with image validation and navbar integration ([PR #32](https://github.com/SmartTvatt/SmartTvatt/pull/32)).

## Week of 2026-09-07
- Started with backend core development: created Express routes, registration controllers, `bcrypt` password hashing, and login authentication logic.
- Built password reset endpoints, token generation, and secure account recovery workflows on the server side.

## Week of 2026-09-14
- Shifted to frontend implementation, building login, registration, and password reset pages aligned with team members' existing UI components and design patterns.
- Connected frontend form states to Express authentication controllers and set up JWT storage and error messaging.

## Week of 2026-09-21
- Configured and deployed MongoDB Atlas cloud database cluster for remote persistence.
- Connected Mongoose models for users, password reset tokens, and roles directly to MongoDB Atlas with environment variable configuration.

## Week of 2026-10-05
- Implemented tenant custom logo upload service (`logoService`) with file validation and header preview integration ([PR #32](https://github.com/SmartTvatt/SmartTvatt/pull/32)).

## Week of 2026-10-19
- Built global `AuthContext` for persistent session management and created dynamic `ProtectedRoute` guards for user and admin paths ([PR #54](https://github.com/SmartTvatt/SmartTvatt/pull/54)).
- Integrated `react-i18next` language switcher (SV/EN) and localized form validation across login and registration forms ([PR #57](https://github.com/SmartTvatt/SmartTvatt/pull/57)).
- Consolidated pull requests, refactored routing architecture, and verified end-to-end authentication flows.

## Final summary
- Responsible for the entire authentication and identity pipeline: backend logic, password resets, frontend views adapted to team designs, MongoDB Atlas cloud deployment, and session state.
- Ensured full integration between authentication state (`AuthContext`), route guards (`ProtectedRoute`), localized form validation, and dynamic branding.
- Verified project stability with `npm run lint` and `npm run build`.
