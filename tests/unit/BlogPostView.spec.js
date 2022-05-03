import { mount } from "@vue/test-utils";
import BlogPostList from "../../src/components/BlogPosts/BlogPostList.vue";
import AddEditBlogPostOverlay from "../../src/components/BlogPosts/AddEditBlogPostOverlay.vue";

describe("Testing BlogPostView.vue", () => {
    it("should have a BlogPostList", () => {
        const wrapper = mount(BlogPostList);

        const blogPostListComponent = wrapper.findComponent(BlogPostList);
        expect(blogPostListComponent.exists()).toBeTruthy();
    });

    it("should have a AddEditBlogPostOverlay", () => {
        const wrapper = mount(AddEditBlogPostOverlay);

        const blogPostOverlayComponent = wrapper.findComponent(
            AddEditBlogPostOverlay
        );
        expect(blogPostOverlayComponent.exists()).toBeTruthy();
    });

    it("should have a FloatingActionButton", () => {
        const wrapper = mount(FloatingActionButton);

        const fabComponent = wrapper.findComponent(FloatingActionButton);
        expect(fabComponent.exists()).toBeTruthy();
    });
});
