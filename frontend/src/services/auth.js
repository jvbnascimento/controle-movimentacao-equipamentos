import api from '../services/api';

export async function singIn(data) {
    try {
        const response = await api.post(`/login/verify/${data}`);

        return response.data;
    } catch (error) {
        console.log(error)
    }
    

    // if (!response) {
    //     console.log("here")
    // }

    // if (response.status === 200) {
    //     
    // }
    // else {
    //     console.log(response.data);
    //     return;
    //     // return {message: 'Login ou senha incorretos. Verifique suas credenciais e tente novamente.'};
    // }
}