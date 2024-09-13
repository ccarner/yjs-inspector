import { HocuspocusProvider } from '@hocuspocus/provider'
import * as Y from "yjs";
import { ConnectProvider } from "./types";

export class HocuspocusConnectProvider implements ConnectProvider {
  doc: Y.Doc;
  private provider: HocuspocusProvider;
  syncedPromise: Promise<void>

  constructor(url: string, room: string, doc: Y.Doc) {
    this.doc = doc;
    this.syncedPromise = new Promise((resolve) => {
        this.provider = new HocuspocusProvider({
            url, 
            name: room, 
            document: doc,
            onSynced: () => {
                resolve()
            }
        })

        console.log('created hocuspocus provider', this.provider)
  });
  }

  connect() {
    this.provider.connect();
  }

  disconnect() {
    this.provider.disconnect();
    this.provider.destroy();
  }

  async waitForSynced() {
    await this.syncedPromise
  }
}
