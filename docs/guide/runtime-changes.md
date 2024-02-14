---
title: Runtime breaks | Guide
outline: deep
---

# Runtime changes

While Cbjs aims to be 100% compatible with the official client, if you rely on unsound behavior, a tiny change may result in a different runtime.
For this reason we list here the tiny changes in Cbjs that may affect your existing project.

**Timeout of 0**

If you pass a timeout of `0` to the official library, it will fallback to the default timeout. Cbjs will use your value of `0`.
