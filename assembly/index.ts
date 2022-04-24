// @nearfile
import { Tip, ReturnObject, ReturnTip, tips, receiverIdx, senderIdx, trackIdx, accountToId, idToAccount, trackOwner } from './model';
import { context, ContractPromiseBatch, PersistentVector, u128, storage } from "near-sdk-as";



function _accountToId(account: string): u32 {
  assert(account != '', "Account is blank");

  if (accountToId.contains(account)) {
    return accountToId.getSome(account);
  }

  let userCount = storage.getPrimitive<u32>('uc', 0);
  userCount++;
  accountToId.set(account, u32(userCount));
  idToAccount.set(u32(userCount), account);
  storage.set<u32>('uc', u32(userCount));
  return userCount;  
}

function _idToAccount(id: u32): string {
  const account = idToAccount.get(id);
  return account ? account : '';    
}