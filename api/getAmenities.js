const fetch = require('node-fetch');

export default async function handler(req, res) {
    const { listingId } = req.query;

    if (!listingId) {
        return res.status(400).json({ error: 'Listing ID is required' });
    }

    try {
        const response = await fetch(`https://api.hostaway.com/v1/listings/${listingId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.HOSTAWAY_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: errorData.message });
        }

        const data = await response.json();
        const amenities = data.amenities || [];

        res.status(200).json({ amenities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
