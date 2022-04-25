export function validateUsername(username) {
    return (username && username.length >= 3 && username.length <= 50) == true;
}

export function validatePassword(password) {
    return (password && password.length >= 4 && password.length <= 50) == true;
}

export function validateRole(role) {
    return (role === "STUDENT" || role === "ADMIN") == true;
}

export function validateBlogPost(blogPost) {
    const { title, content } = blogPost;
    return [
        (title && title.length >= 5 && title.length <= 255) == true,
        (content && content.length >= 5 && content.length <= 3000) == true,
    ];
}
