const fs = require('fs');
let cities = [];
let citiesAlphabeticalCount = [];
async function getAllNovaPostCities() {
    let page = 1;
    let pageLimit = 500;

    let responseIsEmpty = false;

    while (!responseIsEmpty) {
        const apiUrl = 'https://api.novaposhta.ua/v2.0/json/'; // POST

        const data = {
            apiKey: "07e4a86cc0f63f9ee4867b58c2034c5b",
            modelName: "Address",
            calledMethod: "getSettlements",
            methodProperties: {
                Page: page,
                Limit: pageLimit,
            },
        };

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch(apiUrl, requestOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseJson = await response.json();

            if (responseJson.data.length > 0) {
                cities.push(...responseJson.data.map(item => {
                    return {
                        Description: item.Description,
                        AreaDescription: item.AreaDescription
                    }
                }));

                // Write data to file after each request
                const contentToWrite = JSON.stringify(cities, null, 2);
                await fs.promises.writeFile('cities.json', contentToWrite, 'utf8');

                console.log(`Page ${page} data written successfully!`);

            } else {
                responseIsEmpty = true;
            }
        } catch (error) {
            console.error('Error: ', error);
        }

        page++;
    }

    console.log('Finished');
}

async function getCitiesCountByLetter() {
    const cyrillicAlphabet = [
        'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м',
        'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ',
        'ы', 'ь', 'э', 'ю', 'я'
    ];
    const apiUrl = 'https://api.novaposhta.ua/v2.0/json/'; // POST


    for (let letter of cyrillicAlphabet) {
        const data = {
            apiKey: "07e4a86cc0f63f9ee4867b58c2034c5b",
            modelName: "Address",
            calledMethod: "getSettlements",
            methodProperties: {
                Page: 1,
                Limit: 1,
                FindByString: letter
            },
        };
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(data),
        };
        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();

        const count = json.info.totalCount;

        citiesAlphabeticalCount.push({letter: letter, count: count})
    }

    const contentToWrite = JSON.stringify(citiesAlphabeticalCount, null, 2);
    await fs.promises.writeFile('citiesCountByName.json', contentToWrite, 'utf8');

}

getAllNovaPostCities();
getCitiesCountByLetter();