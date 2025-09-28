/**
 * 
 * @param {string} url 
 * @returns {Promise<JSON[]>}
 */
export async function fetchRedditPosts(url = "") {
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP status error: ${response.status}`);
        }

        const json = await response.json();

        return json.data?.children?.map(child => child.data);
    } catch (error) {
        console.error("Error fetching Reddit posts:", error.message);
        
        return [];
    }
}

/**
 * 
 * @param {JSON[]} posts 
 * @param {number} blockSize
 * @returns {Array<JSON[]>}
 */
export function dividePostsIntoBlocks(posts, blockSize = 12) {
    const blocks = [];
    
    for (let i = 0; i < posts.length; i += blockSize) {
        blocks.push(posts.slice(i, i + blockSize));
    }

    return blocks;
}