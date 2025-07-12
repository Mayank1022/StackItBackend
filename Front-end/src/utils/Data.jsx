export function getData (url) {
    const get = async () => {
        await fetch(url,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }}).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
        })
        .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
        });
    }
    return get;
}


export function sendData  (url,data) {
    const res = async () => {
        await fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
        })
        .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
        });
    }

    return res;
}