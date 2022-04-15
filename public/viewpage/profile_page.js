import { MENU,root } from './elements.js';
import { ROUTE_PATHNAMES } from '../controller/route.js';
import { getAccountInfo, updateAccountInfo } from '../controller/firestore_controller.js';
import { currentUser } from '../controller/firebase_auth.js';
import { info,disableButton,enableButton } from './util.js';
import { DEV } from '../model/constants.js';
import { uploadProfilePhoto } from '../controller/storage_controller.js';

export let accountInfo = null;

export function addEventListeners(){
    MENU.Profile.addEventListener('click',async() => {
        history.pushState(null,null,ROUTE_PATHNAMES.PROFILE);
        await profile_page();

    });
}

export async function profile_page(){
    if(!currentUser){
        root.innerHTML = '<h2>Protected Page</h2>';
        return;
    }

    let html = '<h1>Profile Page</h1>';
    if(!accountInfo){
        html += `
            <h2>Failed to retrieve account info for ${currentUser.email}</h2>
        `;
        root.innerHTML = html;
        return;
    }

    html += `
        <div class="alert alert-primary">
            Email: ${currentUser.email} (Cannot change email as a login name)
        </div>
    `;

    

    html += `
        <form id="form-update-profile" method="post">
            <table class="table">
                <tbody>
                    <tr>
                        <td width="15%">Name:</td>
                        <td>
                            <input type="text" name="name" value="${accountInfo.name}" disabled required
                                placeholder="firstname lastname" pattern="^[A-Za-z][A-Za-z|'|-| ]+">
                        </td>
                    <tr>
                    <tr>
                        <td width="15%">Address:</td>
                        <td>
                            <input type="text" name="address" value="${accountInfo.address}" disabled required
                                placeholder="address" minlength="4">
                        </td>
                    <tr>
                    <tr>
                        <td width="15%">City:</td>
                        <td>
                            <input type="text" name="city" value="${accountInfo.city}" disabled required
                                placeholder="City" minlength="2">
                        </td>
                    <tr>
                    <tr>
                        <td width="15%">State:</td>
                        <td>
                            <input type="text" name="state" value="${accountInfo.state}" disabled required
                                placeholder="State (uppercase 2 letter state code)"
                                pattern="[A-Z]+" minlength="2" maxlength="2">
                        </td>
                    <tr>
                    <tr>
                        <td width="15%">Zip:</td>
                        <td>
                            <input type="text" name="zip" value="${accountInfo.zip}" disabled required
                                placeholder="5 digit zip code"
                                pattern="[0-9]+" minlength="5" maxlength="5">
                        </td>
                    <tr>
                    <tr>
                        <td width="15%">Credit Card #:</td>
                        <td>
                            <input type="text" name="creditNo" value="${accountInfo.creditNo}" disabled required
                                placeholder="credit card number" pattern="[0-9]+" minlength="15" maxlength="16">
                        </td>
                    <tr>
                </tbody>
            </table>
            <div>
                <button type="submit" class="btn btn-outline-primary"
                    onclick="this.form.submitter='EDIT'">Edit</button>
                <button type="submit" class="btn btn-outline-danger" style="display: none;"
                    onclick="this.form.submitter='UPDATE'">Update</button>
                <button type="submit" class="btn btn-outline-secondary" style="display: none;"
                    onclick="this.form.submitter='CANCEL'" formnovalidate="true">Cancel</button>
            </div>
        </form>
    `;

    html +=`
        <hr class="mt-5">
        Profile Picture:
        <container>
            <div>
                <input type="file" id="profile-photo-upload" value="upload">
            </div>
            <div>
                <img id="profile-preview-img" src="${accountInfo.photoURL}" class="rounded-circle" width="250px">
            </div>
            <div>
                <button id="profile-photo-update" class="btn btn-outline-danger">Update Photo</button>
            </div>
        <container>
    `;

    root.innerHTML = html;

    let photoFile;

    const profilePhotoUpdate = document.getElementById('profile-photo-update');
    profilePhotoUpdate.addEventListener('click', async () => {
        if(!photoFile){
            info("No photo selected",'Choose a profile photo');
            return;
        }
        const label = disableButton(profilePhotoUpdate);
        try{
            const photoURL = await uploadProfilePhoto(photoFile, currentUser.uid);
            await updateAccountInfo(currentUser.uid,{photoURL});
            accountInfo.photoURL = photoURL;
            MENU.Profile.innerHTML = `
                <img src="${accountInfo.photoURL}" class="rounded-circle" height="30 px">
            `;
            photoFile = null;
            document.getElementById('profile-photo-upload').value = null;
            info('Success!','Profile photo updated!');
        } catch (e) {
            if(DEV) console.log(e);
            info('Photo update error',JSON.stringify(e));
        }
        enableButton(profilePhotoUpdate,label);
    });

    document.getElementById('profile-photo-upload').addEventListener('change',e=>{
        photoFile = e.target.files[0];
        if(!photoFile){
            document.getElementById('profile-preview-img').src = accountInfo.photoURL;
            return;
        }
        const reader = new FileReader();
        reader.onload = () => document.getElementById('profile-preview-img').src = reader.result;
        reader.readAsDataURL(photoFile);
    })

    document.getElementById('form-update-profile').addEventListener('submit', async e=>{
        e.preventDefault();
        const buttons = e.target.getElementsByTagName('button');
        const inputs = e.target.getElementsByTagName('input');
        const submitter = e.target.submitter;
        if(submitter =='EDIT'){
            buttons[0].style.display = 'none';
            buttons[1].style.display = 'inline-block';
            buttons[2].style.display = 'inline-block';
            for(let i=0;i<inputs.length;i++) inputs[i].disabled = false;
        } else if (submitter =='UPDATE'){
            const updateInfo ={};
            if(e.target.name.value.trim()!=accountInfo.name) updateInfo.name = e.target.name.value.trim();
            if(e.target.address.value.trim()!=accountInfo.address) updateInfo.address = e.target.address.value.trim();
            if(e.target.city.value.trim()!=accountInfo.city) updateInfo.city = e.target.city.value.trim();
            if(e.target.state.value.trim()!=accountInfo.state) updateInfo.state = e.target.state.value.trim();
            if(e.target.zip.value.trim()!=accountInfo.zip) updateInfo.zip = e.target.zip.value.trim();
            if(e.target.creditNo.value.trim()!=accountInfo.creditNo) updateInfo.creditNo = e.target.creditNo.value.trim();

            if(Object.keys(updateInfo).length > 0 ){
                const label = disableButton(buttons[1]);
                try{
                    await updateAccountInfo(currentUser.uid,updateInfo);
                    Object.keys(updateInfo).forEach(key => accountInfo[key] = updateInfo[key]);
                } catch(e){
                    if(DEV) console.log(e);
                    info('Update Account Error',JSON.stringify(e));
                }
                enableButton(buttons[1],label);
            }            
            
            buttons[0].style.display = 'block';
            buttons[1].style.display = 'none';
            buttons[2].style.display = 'none';
            for(let i=0;i<inputs.length;i++) inputs[i].disabled = true;
        } else if (submitter == 'CANCEL'){
            buttons[0].style.display = 'block';
            buttons[1].style.display = 'none';
            buttons[2].style.display = 'none';
            for(let i=0;i<inputs.length;i++) inputs[i].disabled = true;
            e.target.name.value = accountInfo.name;
            e.target.address.value = accountInfo.address;
            e.target.city.value = accountInfo.city;
            e.target.state.value = accountInfo.state;
            e.target.zip.value = accountInfo.zip;
            e.target.creditNo.value = accountInfo.creditNo;
        } else {
            if(DEV)console.log(e);
            return;
        }
    });
}

export async function readAccountProfile(){
    try {
        accountInfo = await getAccountInfo(currentUser.uid);
    } catch(e) {
        if(DEV) console.log(e);
        info(`Failed to retrieve account info for ${currentUser.email}`,JSON.stringify(e));
        accountInfo = null;
        return;
    }
    MENU.Profile.innerHTML = `
        <img src="${accountInfo.photoURL}" class="rounded-circle" height="30 px">
    `;
}