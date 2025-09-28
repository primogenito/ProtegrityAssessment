import { fetchRedditPosts, dividePostsIntoBlocks } from "./modules/posts.js";
import { truncateText, nextPage, previousPage, goToPage } from "./modules/utilities.js";

const { createApp, ref, computed, onBeforeMount } = Vue; // From global object

createApp({
    setup() {
        const date = ref(new Date().getFullYear());
        const posts = ref([]);
        const currentPage = ref(0);
        const totalPages = computed(() => posts.value.length);
        const subReddit = ref("data");
        const postTypeOptions = ref(["hot", "new", "top"]);
        const postType = ref("hot");
        const postLimit = ref(36); // Total number of posts to fetch
        const loading = ref(true); // Display loading indicator
        const redditUrl = computed(() => 
            `/reddit?sub=${subReddit.value}&type=${postType.value}&limit=${postLimit.value}`
        );

        const changePostType = async type => {
            if (postTypeOptions.value.includes(type)) {
                postType.value = type;
                loading.value = true;

                const list = await fetchRedditPosts(redditUrl.value);
                posts.value = dividePostsIntoBlocks(list);

                currentPage.value = 0; // Reset to first page
                loading.value = false;
            }
            else {
                console.error("Invalid post type requested:", type);
            }
        };

        onBeforeMount(async () => {
            loading.value = true;

            const list = await fetchRedditPosts(redditUrl.value);
            posts.value = dividePostsIntoBlocks(list);
            loading.value = false;
        });
        
        // Expose to template
        return { 
            date,
            loading,
            postTypeOptions, 
            postType,
            posts,
            currentPage,
            totalPages,
            nextPage,
            previousPage,
            goToPage,
            truncateText,
            changePostType
        };
    }
}).mount("#redditApp")

