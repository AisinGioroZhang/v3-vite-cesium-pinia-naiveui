import * as T from './types'
import http from '../http'

const loginApi: T.ILoginApi = {
    login(params) {
        return http.post('/login', params)
    }

}
export default loginApi
