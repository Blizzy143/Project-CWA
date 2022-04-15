import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
 } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-storage.js";

 import { STORAGE_FOLDER_NAMES } from "../model/constants.js";

 const storage = getStorage();

 export async function uploadProfilePhoto(photoFile, imageName){
     const storageRef = ref(storage, STORAGE_FOLDER_NAMES.PROFILE_PHOTOS + imageName);
     const snapShot = await uploadBytes(storageRef, photoFile);
     const photoURL = await getDownloadURL(snapShot.ref);
     return photoURL;
}