const groupTracksByDates = radios => {
    return radios
        .map(radio => radio.tracks)
        .flat()
        .reduce((dateGroups, track) => {
            return {
                ...dateGroups,
                [track.timestp]: {
                    ...dateGroups[track.timestp],
                    [track.trackName]: (dateGroups[track.timestp]?.[track.trackName] || 0) + 1
                },
            }
        }, {})
}

const sumTotalTrackPlays = tracks => Object.keys(tracks)
    .reduce((totalPlays, track) => totalPlays + tracks[track], 0)

const generateDateTracksTooltip = tracks => Object.keys(tracks)
                .sort((a, b) => a.localeCompare(b))
                .map(track => `${track} (${tracks[track]})`)
                .join(', ')

const convertTrackByDatesToChartData = tracksByDates => Object.entries(tracksByDates)
        .map(([date, tracks]) => ({
            x: date,
            y: sumTotalTrackPlays(tracks),
            tooltip: generateDateTracksTooltip(tracks),
        }))
        .sort((a, b) => a.x.localeCompare(b.x))

const generateChartData = response => {
    const tracksByDates = groupTracksByDates(response)
    return convertTrackByDatesToChartData(tracksByDates)
}

const response = [
    {
        id: 1293487,
        name: "KCRW",  // radio station callsign
        tracks: [{ timestp: "2021-04-08", trackName: "Peaches" }]
    },
    {
        id: 12923,
        name: "KQED",
        tracks: [
            { timestp: "2021-04-09", trackName: "Savage" },
            { timestp: "2021-04-09", trackName: "Savage (feat. Beyonce)" },
            { timestp: "2021-04-08", trackName: "Savage" },
            { timestp: "2021-04-08", trackName: "Savage" },
            { timestp: "2021-04-08", trackName: "Savage" }
        ]
    },
    {
        id: 4,
        name: "WNYC",
        tracks: [
            { timestp: "2021-04-09", trackName: "Captain Hook" },
            { timestp: "2021-04-08", trackName: "Captain Hook" },
            { timestp: "2021-04-07", trackName: "Captain Hook" }
        ]
    }
];

console.log(generateChartData(response))