//http.ts
import axios, {AxiosRequestConfig} from 'axios'
import NProgress from 'nprogress'

// 设置请求头和请求路径
axios.defaults.baseURL = 'http://192.168.5.194:8001/'
axios.defaults.timeout = 10000                                      
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// 请求拦截器，当所有配置处理完，在向服务器发送请求之前，我们拦截到现有的配置，再去做一些统一修改
axios.interceptors.request.use(
    (config): AxiosRequestConfig<any> => {
        const token = window.sessionStorage.getItem('token')
        if (token) {
            //@ts-ignore
            config.headers.token = token
        }
        return config
    },
    (error) => {
        return error
    }
)
// 响应拦截
axios.interceptors.response.use((res) => {
    if (res.data.code === 111) {
        sessionStorage.setItem('token', '')
        // token过期操作
    }
    return res
})

interface ResType<T> {
gribValues: any
[x: string]: any
    code: number
    data?: T
    msg: string
    err?: string
}

interface Http {
    get<T>(url: string, params?: unknown): Promise<ResType<T>>

    post<T>(url: string, params?: unknown): Promise<ResType<T>>

    upload<T>(url: string, params: unknown): Promise<ResType<T>>

    download(url: string): void
}

const http: Http = {
    get(url, params) {
        return new Promise((resolve, reject) => {
            NProgress.start()
            axios
                .get(url, {params})
                .then((res) => {
                    NProgress.done()
                    resolve(res.data)
                })
                .catch((err) => {
                    NProgress.done()
                    reject(err.data)
                })
        })
    },
    post(url, params) {
        return new Promise((resolve, reject) => {
            NProgress.start()            
            axios
                .post(url, JSON.stringify(params))
                .then((res) => {
                    NProgress.done()
                    resolve(res.data)
                })
                .catch((err) => {
                    NProgress.done()
                    reject(err.data)
                })
        })
    },
    upload(url, file) {
        return new Promise((resolve, reject) => {
            NProgress.start()
            axios
                .post(url, file, {
                    headers: {'Content-Type': 'multipart/form-data'},
                })
                .then((res) => {
                    NProgress.done()
                    resolve(res.data)
                })
                .catch((err) => {
                    NProgress.done()
                    reject(err.data)
                })
        })
    },
    download(url) {
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.src = url
        iframe.onload = function () {
            document.body.removeChild(iframe)
        }
        document.body.appendChild(iframe)
    },
}
export default http
