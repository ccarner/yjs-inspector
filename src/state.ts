import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { YShapeItem } from "./components/filter-sphere";
import { filterYDoc } from "./filter-map";

const TRACK_ALL_ORIGINS = Symbol();

function createUndoManager(doc: Y.Doc) {
  const undoManager = new Y.UndoManager([], {
    doc,
    trackedOrigins: new Set([TRACK_ALL_ORIGINS]),
  });
  const updateScope = () => {
    // The UndoManager can only track shared types that are created
    // See https://discuss.yjs.dev/t/global-document-undo-manager/2555
    const keys = Array.from(doc.share.keys());
    if (!keys.length) return;
    const scope = keys.map((key) => doc.get(key));
    undoManager.addToScope(scope);
    // undoManager.addTrackedOrigin(origin);
  };
  doc.on("beforeTransaction", (transaction) => {
    // Try to track all origins
    // Workaround for https://github.com/yjs/yjs/issues/624
    transaction.origin = TRACK_ALL_ORIGINS;
    // Track all shared types before running UndoManager.afterTransactionHandler
    updateScope();
  });
  return undoManager;
}

const defaultYDoc = new Y.Doc();
const defaultUndoManager = createUndoManager(defaultYDoc);

const undoManagerAtom = atom<Y.UndoManager>(defaultUndoManager);

const yDocAtom = atom(defaultYDoc, (get, set, newDoc: Y.Doc) => {
  if (newDoc === get(yDocAtom)) return;
  get(undoManagerAtom).destroy();
  const undoManager = createUndoManager(newDoc);
  set(undoManagerAtom, undoManager);
  get(yDocAtom).destroy();
  set(yDocAtom, newDoc);
});

export const useYDoc = () => {
  return useAtom(yDocAtom);
};

export const useUndoManager = () => {
  const undoManager = useAtomValue(undoManagerAtom);
  const [state, setState] = useState({
    canUndo: undoManager.canUndo(),
    canRedo: undoManager.canRedo(),
    undoStackSize: undoManager.undoStack.length,
    redoStackSize: undoManager.redoStack.length,
  });

  // TODO use useSyncExternalStore
  useEffect(() => {
    const callback = () => {
      setState({
        canUndo: undoManager.canUndo(),
        canRedo: undoManager.canRedo(),
        undoStackSize: undoManager.undoStack.length,
        redoStackSize: undoManager.redoStack.length,
      });
    };
    callback();

    undoManager.on("stack-item-added", callback);
    undoManager.on("stack-item-popped", callback);
    return () => {
      undoManager.off("stack-item-added", callback);
      undoManager.off("stack-item-popped", callback);
    };
  }, [undoManager]);

  return {
    undoManager,
    ...state,
  };
};

export type Config = {
  parseYDoc: boolean;
  showDelta: boolean;
  showSize: boolean;
  editable: boolean;
  connectUrl: string;
  connectProvider: string;
  connectRoom: string;
};

const defaultConfig = {
  parseYDoc: true,
  showDelta: true,
  showSize: true,
  editable: false,
  connectUrl: '',
  connectProvider: '',
  connectRoom: '',
} satisfies Config;

const configAtom = atomWithStorage<Config>(
  "yjs-playground-config",
  defaultConfig,
);

export const useConfig = () => {
  return useAtom(configAtom);
};

const falseFn = () => false;
const filterPredicateAtom = atom<{ fn: (data: YShapeItem) => boolean }>({
  fn: falseFn,
});

export const useUpdateFilterPredicate = () => {
  const set = useSetAtom(filterPredicateAtom);
  return set;
};

const hasValidFilterRuleAtom = atom(false);

const filteredYDocAtom = atom((get) => {
  const hasValidFilterRule = get(hasValidFilterRuleAtom);
  if (!hasValidFilterRule) {
    return {};
  }
  const yDoc = get(yDocAtom);
  const predicate = get(filterPredicateAtom).fn;
  const filterMap = filterYDoc(yDoc, predicate);
  return filterMap;
});

const filterCountAtom = atom((get) => {
  const data = get(filteredYDocAtom);
  return Object.keys(data).length;
});

export const useSetHasValidFilterRule = () => {
  return useSetAtom(hasValidFilterRuleAtom);
};

export const useFilterMap = () => {
  return useAtomValue(filteredYDocAtom);
};

export const useFilterDataCount = () => {
  return useAtomValue(filterCountAtom);
};

export const useIsFilterEnabled = () => {
  const hasValidFilterRule = useAtomValue(hasValidFilterRuleAtom);
  const config = useAtomValue(configAtom);
  return config.parseYDoc && hasValidFilterRule;
};
