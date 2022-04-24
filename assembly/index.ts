// @nearfile
import { Document, UserSignature, ReturnObject, documentIdx, documents, accountToId, idToAccount } from './model';
import { context, storage } from "near-sdk-as";


export function addDocument(hash: string, witness: string | null, users: string[] | null): ReturnObject<Document | null> | null {

  const senderId = _accountToId(context.sender);
  const witnessId = witness ? _accountToId(witness) : 0;
  const usersId: u32[] = users ? users.map<u32>((user: string): u32 => _accountToId(user)) : [];
  let documentInd = storage.getPrimitive<u32>('dc', 0);

  const document = new Document(witnessId, usersId, senderId, hash);
  documents.set(documentInd, document);

  // add document to user documentIdx
  for (let i = 0; i < usersId.length; i++) {
    let userId = usersId[i];
    let userDocIdx = documentIdx.get(userId, []) as u32[];
    userDocIdx.push(documentInd);
    documentIdx.set(userId, userDocIdx);
  }

  // add document to witness documentIdx
  if (witnessId) {
    let witnessDocIdx = documentIdx.get(witnessId, []) as u32[];
    witnessDocIdx.push(documentInd);
    documentIdx.set(witnessId, witnessDocIdx);
  }

  // add document to sender documentIdx
  let senderDocIdx = documentIdx.get(senderId, []) as u32[];
  senderDocIdx.push(documentInd);
  documentIdx.set(senderId, senderDocIdx);

  // update document index
  documentInd++;
  return {
    success: true,
    error_code: '',
    error_message: '',
    data: document
  };
}

// Sign a document
export function signDocument(documentId: u32, user: string): ReturnObject<UserSignature | null> | null {
  const userId = _accountToId(user) as u32;
  const document = _getDocument(documentId);
  if (!document) {
    return {
      success: false,
      error_code: '',
      error_message: 'Document not found',
      data: null
    };
  }
  // check if user can sign
  if (!_userCanSign(documentId, userId)) {
    return {
      success: false,
      error_code: '',
      error_message: 'User cannot sign',
      data: null
    };
  }


  // check if user is already signed
  let userSignature = document.u.find(us => us.u == userId);
  if (userSignature) {
    return {
      success: false,
      error_code: '',
      error_message: 'User already signed',
      data: null
    };
  }

  userSignature = new UserSignature(userId);
  userSignature.signDocument();
  document.u.push(userSignature);
  documents.set(documentId, document);
  return {
    success: true,
    error_code: '',
    error_message: '',
    data: userSignature
  };
}

// Getters
export function getDocument(id: u32): ReturnObject<Document | null> | null {
  const document = _getDocument(id);
  return {
    success: document != null,
    error_code: '',
    error_message: '',
    data: document
  };
}

export function getDocumentsByUserId(userId: u32): ReturnObject<Array<Document>> | null {
  const userDocIdx = documentIdx.get(userId, []);
  const documents = userDocIdx.map<Document>((id: u32): Document | null => getDocument(id));
  return {
    success: true,
    error_code: '',
    error_message: '',
    data: documents
  };
}

// Check if all users have signed, that means UserSignature c is set
export function isDocumentComplete(documentId: u32): boolean {
  const document = _getDocument(documentId);
  if (!document) {
    return false;
  }
  return document.u.every(us => us.c != 0) && document.w.c != 0;
}

// Private methods

function _accountToId(account: string): u32 {
  assert(account != '', "Account is blank");

  if (accountToId.contains(account)) {
    return accountToId.getSome(account);
  }

  let userCount = storage.getPrimitive<u32>('uc', 1);
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

function _getDocument(documentId: u32): Document | null {
  const document = documents.get(documentId);
  return document;
}

// check if userId is creator, users or witness
function _userCanSign(documentId: u32, userId: u32): boolean {
  const document = _getDocument(documentId);
  if (!document) {
    return false;
  }
  if (document.s == userId) {
    return true;
  }
  if (document.u.find(us => us.u == userId)) {
    return true;
  }
  if (document.w.u == userId) {
    return true;
  }
  return false;
}