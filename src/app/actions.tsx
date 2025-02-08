export async function getData(name: string) {
    const data = fetch(`/api/fda?product=${name}`).then((response) => {
        response.json();
    })
    return data;
};
