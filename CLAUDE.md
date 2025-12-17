# js-ebt CLAUDE.md

## Objective

Make js-ebt compatible with Node 24.x to support OIDC npm publishing in dependent projects.

## Context

- Current: mocha 11.7.4, no explicit Node version constraints
- Goal: Ensure js-ebt works with Node 24.x (npm 11.6.2+)
- Reason: Dependent projects need Node 24 for OIDC token generation with npmjs.org
- js-ebt is a dependency of scv-bilara and other modules
- No other npm dependencies (pure utility library)

## Backlog

1. Test js-ebt against Node 24.x locally
2. Update devDependencies if needed
3. Add Node version constraint to package.json if needed
4. Run full test suite on Node 24.x
