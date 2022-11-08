const WEIGHT_HIGH = 8;
const WEIGHT_MEDIUM = 4;
const WEIGHT_LOW = 1;

const QUERY_LIMIT_FACTOR = 10;
const QUERY_ITEMS_LIMIT = 200;

export const calculateWeight = ([high, medium]) => {
    if (high) {
        return WEIGHT_HIGH;
    }
    if (medium) {
        WEIGHT_MEDIUM;
    }
    return WEIGHT_LOW;
}

export const queryInsightWeight = async ({ weight, id, daysAgo }) => {
    if (!weight) {
        return weight;
    }
    const insightsCount = await snowflakeClientExecuteQuery(
        QUERIES.QUERY_GET_ARTIST_INFO.ARTIST_INSIGHTS.GET_INSIGHTS_COUNT(
            id, WEIGHT_HIGH, WEIGHT_MEDIUM, daysAgo
        )
    );
    return calculateWeight(insightsCount)
};

export const queryInsightResults = ({ id, limit, daysAgo }, weight) => (
    snowflakeClientExecuteQuery(
        QUERIES.QUERY_GET_ARTIST_INFO.ARTIST_INSIGHTS.GET_ARTIST_INSIGHTS(
            id, limit * QUERY_LIMIT_FACTOR, weight, daysAgo
        )
    )
);

export const getFilteredResults = (insightResults) => {
    const filtered = filterResults(insightResults);
    return Promise.all(filtered.map(insight => formatInsight(insight)));
};

export const calculateItemsLimit = (limit) =>
    limit + (QUERY_LIMIT_FACTOR - weight) * QUERY_ITEMS_LIMIT;

export const slicedFilteredResults = ({ filteredResults, limit }) => {
    const results = filteredResults.filter(result => result);
    return results.slice(0, calculateItemsLimit(limit));
}

export const formatSlicedItem = ({ newsFormat, item }) => {
    if (newsFormat) {
        return { insights: insightToNews(item), weight };
    }
    return item;
};

export const getArtistInsights = async (query) => {
    const { newsFormat, limit } = query;
    const weight = await queryInsightWeight(query);
    const insightResults = await queryInsightResults(query, weight);
    const filteredResults = await getFilteredResults(insightResults);
    const slicedResults = slicedFilteredResults({ filteredResults, limit });
    return await Promise.all(
        slicedResults.map(item => formatSlicedItem({ item, newsFormat }))
    );
};