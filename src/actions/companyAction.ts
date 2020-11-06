export const SET_COMPANY = 'SET_COMPANY'
export const SET_EMAIL = 'SET_EMAIL'
export const SET_LOGIN = 'SET_LOGIN'



export function setCompany(company: any) {
    return { type: SET_COMPANY, company: company }
}

export function setLogin(isLogin: boolean) {
    return { type: SET_LOGIN, isLogin: isLogin }
}

/* export function setEmail(email: any) {
    return { type: SET_EMAIL, email: person }
}

export function editSave(person: any) {
    return { type: EDIT_SAVE, person: person }
}

export function delPost(id: any) {
    return { type: DEL_POST, id: id }
}

export function addMode(addMode: any) {
    return { type: ADD_MODE, addMode: addMode }
}

export function addLogin(text: any) {
    return { type: ADD_LOGIN, payload: text }
} */