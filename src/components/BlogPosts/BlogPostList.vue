<template>
    <div v-if="blogPosts.length > 0 && currentUser !== null">
        <div
            v-for="blogPost in blogPosts"
            :key="blogPost.id"
            class="blogpost-container"
        >
            <div class="blogpost-container__header">
                <span class="blogpost-container__title">{{
                    blogPost.title
                }}</span>
                <div class="blogpost-container__title__buttons">
                    <button
                        v-if="
                            blogPost.creatorId === this.currentUser.id ||
                            this.currentUser.role === 'ADMIN'
                        "
                        @click="() => this.onShowEditOverlay(blogPost)"
                        type="button"
                    >
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button
                        v-if="
                            blogPost.creatorId === this.currentUser.id ||
                            this.currentUser.role === 'ADMIN'
                        "
                        @click="() => this.onDeleteBlogPost(blogPost.id)"
                        type="button"
                    >
                        <i class="bi bi-trash-fill"></i>
                    </button>
                    <button
                        v-if="
                            !isVisitor &&
                            blogPost.creatorId !== this.currentUser.id
                        "
                        @click="
                            () =>
                                this.onEditFavorite(
                                    blogPost.id,
                                    blogPost.favorite
                                )
                        "
                        type="button"
                    >
                        <i v-if="!blogPost.favorite" class="bi bi-heart"></i>
                        <i
                            v-if="blogPost.favorite"
                            class="bi bi-heart-fill"
                        ></i>
                    </button>
                </div>
            </div>
            <div class="blogpost-container__content">
                <p class="">
                    {{ blogPost.content }}
                </p>
            </div>
            <div class="blogpost-container__footer">
                <span
                    >{{ blogPost.username }} | {{ blogPost.creationDate }}</span
                >
            </div>
        </div>
    </div>
    <div v-if="blogPosts.length === 0">No Posts found</div>
</template>

<script>
export default {
    name: "BlogPostList",
    props: {
        blogPosts: {
            type: Array,
            required: false,
        },
        currentUser: {
            type: Object,
            required: false,
        },
        isVisitor: {
            type: Boolean,
            required: true,
        },
        onShowEditOverlay: {
            type: Function,
            required: true,
        },
        onDeleteBlogPost: {
            type: Function,
            required: true,
        },
        onEditFavorite: {
            type: Function,
            required: true,
        },
    },
};
</script>

<style scoped>
.blogpost-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 1rem 0;
    border: 1px solid rgb(176, 176, 176);
    border-radius: 0.3rem;
    max-height: 18rem;
    min-height: 13rem;
    overflow: hidden;
    box-shadow: -2px 2px 8px -6px rgba(56, 56, 56, 1);
    background-color: #fff;
    margin-bottom: 3rem;
}

.blogpost-container__header {
    padding: 0.3rem 0.6rem;
    text-transform: uppercase;
    display: flex;
    justify-content: space-between;
    background-color: #eee;
    width: 100%;
    font-size: 1.8rem;
    font-weight: bold;
}

.blogpost-container__title {
    color: #707070;
}

.blogpost-container__title__buttons {
    display: flex;
    align-items: flex-start;
    gap: 0.4rem;
}

.blogpost-container__title__buttons button {
    font-size: 1.4rem;
    background-color: none;
    background: none;
    border: none;
    color: rgb(134, 134, 134);
}

.blogpost-container__title__buttons button:hover {
    cursor: pointer;
}

.bi-heart:hover {
    color: #f64b4b;
}

.bi-heart-fill {
    color: #f64b4b;
}

.bi-heart-fill:hover {
    color: rgb(83, 83, 83);
}

.bi-trash-fill:hover {
    color: red;
}

.bi-pencil-square:hover {
    color: rgb(40, 40, 40);
}

.blogpost-container__content {
    text-align: start;
    padding: 0.3rem 0.6rem;
    width: 100%;
    max-height: 100%;
    overflow-y: auto;
}

.blogpost-container__footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: auto;
    text-align: end;
    width: 100%;
    height: 2.4rem;
    background-color: rgb(250, 250, 250);
    border-top: 1px solid rgb(240, 240, 240);
    padding-right: 0.8rem;
    text-transform: uppercase;
    font-weight: bold;
}
</style>
