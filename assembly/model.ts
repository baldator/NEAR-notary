import { context, PersistentMap } from "near-sdk-as";

const initDate = 1640995200000000000;

/** 
 * Exporting a new class Comment so it can be used outside of this file.
 */
@nearBindgen
export class Document {  // class written to chain as JSON, hence the short variable names
  w: UserSignature; // witness
  u: Array<UserSignature>; // users id
  s: u32; // sender
  c: u32; // date created
  d: string; // ipfs hash
  constructor(withness: u32, users: Array<u32>, sender: u32, hash: string) {
    this.w = new UserSignature(withness);
    this.s = sender;
    this.d = hash;
    this.c = u32((context.blockTimestamp - initDate) / 10 ** 9);
    this.u = [];
    for (var _i = 0; _i < users.length; _i++) {
        let user = new UserSignature(users[_i]);
        this.u.push(user);
    }
    // create user signature for sender
    let senderSig = new UserSignature(sender);
    this.u.push(senderSig);
  }

  isSigner(userId: u32): boolean {
    for (var _i = 0; _i < this.u.length; _i++) {
        let user = this.u[_i];
        if (user.u == userId) {
            return true;
        }
    }
    return false;
  
  }

  hasSigned(userId: u32): boolean {
    for (var _i = 0; _i < this.u.length; _i++) {
        let user = this.u[_i];
        if (user.u == userId && user.c != 0) {
            return true;
        }
    }
    return false;
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

export const accountToId = new PersistentMap<string, u32>("i");
export const idToAccount = new PersistentMap<u32, string>("a");
export const documents   = new PersistentMap<u32, Document>("d"); // 1 {1, 2, 11} // 2 {2, 2, 11}
export const documentIdx = new PersistentMap<u32, Array<u32>>("m"); // user1 [1,2]
