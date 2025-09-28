/**
 * 
 * @param {string} text
 * @param {number} maxLength - default 200
 * @returns {string} Truncated text with ellipsis when is maxLength exceeded
 */
export function truncateText(text, maxLength = 200) {
    if (text.length > maxLength) { 
        return text.slice(0, maxLength) + "...";
    }

    return text;
};

/**
 * 
 * @param {number} current 
 * @param {number} total 
 * @returns {number} Next page index or current page if index is the last one
 */
export function nextPage(current, total) {
    if (current < total - 1) {
        return current + 1;
    }

    return current;
}

/**
 * 
 * @param {number} current 
 * @returns {number} Previous page index or current page if index is the first one
 */
export function previousPage(current) {
    if (current > 0) {
        return current - 1;
    }

    return current;
}

/**
 * 
 * @param {number} index - New page index
 * @param {number} currPage - Current page index
 * @param {number} total - Total number of pages
 * @returns {number} - Index to navigate to
 */
export function goToPage(index, currPage, total) {
    if (index !== currPage && index >= 0 && index < total) {
        return index;
    }

    return currPage;
}