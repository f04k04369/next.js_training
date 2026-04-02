export function fetchRamenRestaurants() {
    const url = "https://places.googleapis.com/v1/places:searchNearby";
    const requestBody = {
        // "includedTypes": ["restaurant"],
        "maxResultCount": 10,
        "locationRestriction": {
            "circle": {
            "center": {
                "latitude": 37.7937,
                "longitude": -122.3965},
            "radius": 500.0
            }
        },
        languageCode:"ja"
    }

    const response = fetch(url, {
        method: "POST",
        body: JSON.stringify(requestBody),
    })
}