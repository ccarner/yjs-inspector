# 🛝 Yjs Inspector

[![Build](https://github.com/yjs/yjs-inspector/actions/workflows/build.yml/badge.svg)](https://github.com/yjs/yjs-inspector/actions/workflows/build.yml)

The playground of [Yjs](https://docs.yjs.dev/).

## ✨ Features

- Connect to a Yjs demo.<br />
  ![image](https://github.com/yjs/yjs-inspector/assets/18554747/144810a2-4da1-4fd3-822d-1f4a015af29f)
- Inspect the Yjs document model<br />
  ![image](https://github.com/yjs/yjs-inspector/assets/18554747/edb040f2-6bdd-4c2a-b9cf-43f7eaef08d2)
- Advanced Filters<br />
  ![image](https://github.com/user-attachments/assets/ecadd716-0163-462e-8762-daf08d964370)
- Edit the Yjs document model.<br />
  ![image](https://github.com/yjs/yjs-inspector/assets/18554747/46a061e9-3466-46bd-91cc-80e80476de37)
- Export the YDoc snapshot
- Dark mode


# COLTON ADDED/MODIFIED
- Migrated to V2 functions for these listed (https://github.com/yjs/yjs#using-v2-update-format)
(NOTE I don't think there's a V2 version of encodeStateVector...  docs are just wrong?)


- Y.encodeStateAsUpdateV2(doc): Encodes the state of the document into the new v2 update format.
Y.applyUpdateV2(doc, update): Applies a binary update in the new v2 format to the Yjs document.
Y.diffUpdateV2(update, stateVector): Computes the difference between a full update and the state vector using the new v2 format.
Y.mergeUpdatesV2(updates): Merges multiple updates into a single update using the new v2 format.
Y.logUpdateV2(update): Logs the contents of an update in the new v2 format, mainly for debugging purposes.
