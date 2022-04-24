import { context, u128, PersistentMap } from "near-sdk-as";

const initDate = 1640995200000000000;

/** 
 * Exporting a new class Comment so it can be used outside of this file.
 */
@nearBindgen
export class Document {  // class written to chain as JSON, hence the short variable names
  w: UserSignature; // witness
  u: Array<UserSignature>; // users id
  s: string; // sender
  c: u32; // date created
  constructor(withness: u32, users: Array<u32>) {
    this.w = new UserSignature(withness);
    this.s = context.predecessor;
    this.c = u32((context.blockTimestamp - initDate) / 10 ** 9);
    this.u = [];
    for (var _i = 0; _i < users.length; _i++) {
        let user = new UserSignature(users[_i]);
        this.u.push(user);
    }
  }
}

@nearBindgen
export class UserSignature {  // only used for return data
  u: u32; // userId
  c: u32; // date signature
  constructor(user: u32) {
    this.u = user;
    this.c = 0;
  }

  signDocument() : void {
    this.c = u32((context.blockTimestamp - initDate) / 10 ** 9);
  }
}

 
@nearBindgen
 export class ReturnObject<T>{
  success: bool; 
  error_code: string;
  error_message: string;
  data: T;
}

export const accountToId = new PersistentMap<string, u32>("ai");
export const idToAccount = new PersistentMap<u32, string>("ia");
export const tips        = new PersistentMap<u32, Tip>("t"); // 1 {1, 2, 11} // 2 {2, 2, 11}
export const receiverIdx = new PersistentMap<u32, Array<u32>>("rx"); // reciever1 [1,2]
export const senderIdx   = new PersistentMap<u32, Array<u32>>("sx"); // sender1 [1] // sender2 [2]
export const trackIdx    = new PersistentMap<u32, Array<u32>>("tx"); // 12 (trackid)  [1,2]
export const trackOwner  = new PersistentMap<u32, u32>("to"); // 1 2 - user 1 owns track 2

/**
 * collections.vector is a persistent collection. Any changes to it will
 * be automatically saved in the storage.
 * The parameter to the constructor needs to be unique across a single contract.
 * It will be used as a prefix to all keys required to store data in the storage.
 */
//export const tips = new PersistentMap<string, TrackTips>("");
//export const receivers = new PersistentMap<string, PersistentVector<Tip>>("r");