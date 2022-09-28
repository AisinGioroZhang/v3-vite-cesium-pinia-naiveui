import http from '@/service/api/http'

export default function () {
    
    /**
     * 
     * @param params 
     * @returns 
     */
    function queryWeather(params: any) {          
        return http.post('/weather/query', params)
    }

    return { queryWeather }
}


